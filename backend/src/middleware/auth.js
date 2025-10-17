import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log('[AUTH MIDDLEWARE]', { 
      path: req.path, 
      method: req.method,
      hasAuthHeader: !!authHeader,
      authHeader: authHeader ? `${authHeader.substring(0, 20)}...` : 'none'
    });
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[AUTH MIDDLEWARE] No Bearer token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Get admin from database
    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      console.log('[AUTH MIDDLEWARE] Admin not found for token');
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('[AUTH MIDDLEWARE] Auth successful for:', admin.username);
    // Attach admin to request
    req.admin = admin;
    next();
  } catch (error) {
    console.log('[AUTH MIDDLEWARE] Token verification failed:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const isSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super-admin') {
    return res.status(403).json({ message: 'Access denied. Super admin only.' });
  }
  next();
};
