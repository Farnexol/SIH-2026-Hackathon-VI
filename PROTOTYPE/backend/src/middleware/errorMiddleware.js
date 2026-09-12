import { sendError } from '../utils/responseHandler.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    return sendError(res, `${field} already exists`, 409);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    const message = messages.join(', ') || 'Validation error';
    return sendError(res, message, 400, messages);
  }

  // CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, `Invalid resource identifier: ${err.value}`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired', 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};
