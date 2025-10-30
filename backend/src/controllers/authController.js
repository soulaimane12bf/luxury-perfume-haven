import Admin from '../models/admin.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import resend from '../lib/resend.js';
import crypto from 'crypto';
// Password reset request
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 1000 * 60 * 30; // 30 minutes
    admin.reset_token = token;
    admin.reset_token_expires = expires;
    await admin.save();

    // Build reset link (adjust frontend URL as needed)
    const resetLink = `${process.env.FRONTEND_URL || 'https://cosmedstores.com'}/reset-password?token=${token}`;

    // Send email via Resend
    await resend.emails.send({
      from: 'no-reply@cosmedstores.com',
      to: admin.email,
      subject: 'Password Reset Request',
      html: `<p>Hello,</p><p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link will expire in 30 minutes.</p>`
    });

    return res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Return masked admin email so frontend can show a hint without exposing full address
export const getMaskedAdminEmail = async (req, res) => {
  try {
    const admin = await Admin.findOne({ where: { role: 'super-admin' } });
    if (!admin || !admin.email) return res.status(404).json({ message: 'Admin email not configured' });
    const email = admin.email;
    const [local, domain] = email.split('@');
    const firstTwo = local.slice(0, 2);
    const masked = `${firstTwo}*****@${domain}`;
    return res.json({ masked });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Password reset confirmation
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const admin = await Admin.findOne({ where: { reset_token: token } });
    if (!admin || !admin.reset_token_expires || Date.now() > admin.reset_token_expires) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    admin.password = password;
    admin.reset_token = null;
    admin.reset_token_expires = null;
    await admin.save();
    return res.json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
      // Allow login by username OR email for convenience.
      const identifier = username && username.includes('@') ? { email: username } : { username };
      const admin = await Admin.findOne({ where: identifier });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register new admin (super-admin only)
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      where: { 
        [Op.or]: [{ username }, { email }] 
      } 
    });
    
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create new admin
    const admin = await Admin.create({
      username,
      email,
      password,
      role: role || 'admin'
    });

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify token
export const verifyToken = async (req, res) => {
  try {
    res.json({
      admin: {
        id: req.admin.id,
        username: req.admin.username,
        email: req.admin.email,
        role: req.admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
