import Admin from '../models/admin.js';
import bcrypt from 'bcryptjs';

// Get admin profile
export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ['password'] }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update admin profile (username, email, phone, smtp credentials)
export const updateProfile = async (req, res) => {
  try {
    const { username, email, phone, smtp_email, smtp_password } = req.body;
    const admin = await Admin.findByPk(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if username is taken by another admin
    if (username && username !== admin.username) {
      const existingUsername = await Admin.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      admin.username = username;
    }

    // Check if email is taken by another admin
    if (email && email !== admin.email) {
      const existingEmail = await Admin.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already taken' });
      }
      admin.email = email;
    }

    // Update phone
    if (phone !== undefined) {
      admin.phone = phone;
    }

    // Update SMTP credentials
    if (smtp_email !== undefined) {
      admin.smtp_email = smtp_email;
    }
    if (smtp_password !== undefined) {
      admin.smtp_password = smtp_password;
    }

    await admin.save();

    // Return updated admin without sensitive fields
    const updatedAdmin = admin.toJSON();
    delete updatedAdmin.password;
    delete updatedAdmin.smtp_password; // Don't send SMTP password back

    res.json({ 
      message: 'Profile updated successfully', 
      admin: updatedAdmin 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Update admin password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }

    const admin = await Admin.findByPk(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password (will be hashed by the model hook)
    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
};
