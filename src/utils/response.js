// Success Response
export const successResponse = (
  res,
  data = {},
  message ,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Error Response
export const errorResponse = (
  res,
  message = "Something went wrong",
  error = null,
  statusCode = 500
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};