const ApiResponse = {
  success: (res, data = {}, statusCode = 200, message = "Success") => {
    console.log({ statusCode });
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
  },

  error: (
    res,
    errors = [],
    statusCode = 500,
    message = "An error occurred"
  ) => {
    return res.status(statusCode).json({
      status: "error",
      message,
      errors,
    });
  },
};

module.exports = { ApiResponse };
