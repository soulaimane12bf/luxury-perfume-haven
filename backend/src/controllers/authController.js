import Admin from '../models/admin.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { databaseReady } from '../app.js';

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // TEMPORARY FALLBACK: allow env-based admin login when DB is not ready.
    // WARNING: keep this only briefly for emergency access. Do NOT leave in production.
    if (!databaseReady) {
      const envUser = process.env.ADMIN_USERNAME;
      const envPass = process.env.ADMIN_PASSWORD;
      if (envUser && envPass) {
        if (username === envUser && password === envPass) {
          const token = jwt.sign(
            { id: 'env-admin', username: envUser, role: process.env.ADMIN_ROLE || 'super-admin' },
            process.env.JWT_SECRET || 'temp-secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
          );

          return res.json({
            token,
            admin: {
              id: 'env-admin',
              username: envUser,
              email: process.env.ADMIN_EMAIL || null,
              role: process.env.ADMIN_ROLE || 'super-admin'
            }
          });
        }

        return res.status(401).json({ message: 'Invalid credentials' });
      }

      return res.status(503).json({ message: 'Database not ready' });
    }

    // Find admin by username
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
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
