class AppError extends Error {
  constructor(message, statusCode = 500, name = "Error") {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    if ("captureStackTrace" in Error) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
