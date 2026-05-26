import jwt from 'jsonwebtoken';
import { getDb } from '../db/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';

// Role hierarchy and permissions
const ROLE_PERMISSIONS = {
  admin: ['admin', 'products', 'orders', 'customers', 'content', 'analytics', 'settings', 'logs', 'licenses', 'users'],
  user: [],
};

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user is blocked
    const db = getDb();
    const user = db.prepare('SELECT id, email, role, is_blocked FROM users WHERE id = ?').get(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (user.is_blocked) return res.status(403).json({ error: 'Account is blocked' });

    req.user = { ...decoded, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireAuth(req, res, next) {
  verifyToken(req, res, next);
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

export function requirePermission(...permissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userPerms = ROLE_PERMISSIONS[req.user.role] || [];
    const hasAccess = permissions.some(p => userPerms.includes(p));

    if (!hasAccess) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}

