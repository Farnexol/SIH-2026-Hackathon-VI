import { sendError } from '../utils/responseHandler.js';

export const notFound = (req, res, next) => {
  return sendError(res, `Route not found: ${req.originalUrl}`, 404);
};
