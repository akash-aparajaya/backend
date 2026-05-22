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
  error = {}
) => {
  return res.status(500).json({
    success: false,
    message,
    error,
  });
};