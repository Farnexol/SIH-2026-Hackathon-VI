/**
 * Standardized API Response Utilities
 * Ensures consistent response envelope:
 * Success: { success: true, data: ..., message: ... }
 * Error:   { success: false, message: ..., errors: ... }
 */

export const sendSuccess = (res, data = {}, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message
  };

  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};
