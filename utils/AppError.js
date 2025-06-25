class AppError extends Error {
  constructor(message, statusCode = 500, name = "Error") {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    if ("captureStackTrace" in Error) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(msg) {
    return new AppError(msg, 400, "Bad Request Error");
  }

  static unauthorized(msg) {
    return new AppError(msg, 401, "Unauthorized Error");
  }

  static forbidden(msg) {
    return new AppError(msg, 403, "Forbidden Error");
  }

  static notFound(msg) {
    return new AppError(msg, 404, "Not Found Error");
  }

  static internal(msg) {
    return new AppError(msg, 500, "Internal Error");
  }
}

export default AppError;
