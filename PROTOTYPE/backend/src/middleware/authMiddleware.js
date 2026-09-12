import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/responseHandler.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized, access token missing', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendError(res, 'User belonging to this token no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Not authorized, token validation failed', 401);
  }
};
