/**
 * Every error thrown in the SDK is an instance of 'APIError'. The value of the 'code' property is eligible to
 * translate the error into an error message.
 */
abstract class APIError extends Error {
  code: string;
  cause?: Error;

  protected constructor(message: string, code: string, cause?: Error) {
    super(message);
    this.code = code;
    this.cause = cause;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Every error that doesn't need to be handled in a special way is a 'TechnicalError'. Whenever you catch one, there is
 * usually nothing you can do but present an error to the user, e.g. "Something went wrong".
 */
class TechnicalError extends APIError {
  constructor(cause?: Error) {
    super(
      "Something went wrong. Please try again. If the problem persists contact support",
      "somethingWentWrong",
      cause
    );
    Object.setPrototypeOf(this, TechnicalError.prototype);
  }
}

/**
 * A 'RequestTimeoutError' occurs when the specified timeout has been reached.
 */
class RequestTimeoutError extends APIError {
  constructor(cause?: Error) {
    super("Request timed out error", "requestTimeout", cause);
    Object.setPrototypeOf(this, RequestTimeoutError.prototype);
  }
}

/**
 * An 'InvalidPasswordError' occurs when invalid credentials are provided when logging in with a password.
 */
class InvalidPasswordError extends APIError {
  constructor(cause?: Error) {
    super("Invalid email or password", "invalidPassword", cause);
    Object.setPrototypeOf(this, InvalidPasswordError.prototype);
  }
}

/**
 * An 'UnauthorizedError' occurs when the user is not authorized to access the resource.
 */
class UnauthorizedError extends APIError {
  // eslint-disable-next-line require-jsdoc
  constructor(cause?: Error) {
    super("Unauthorized error", "unauthorized", cause);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * A 'NotFoundError' occurs when the requested resource was not found.
 */
class NotFoundError extends APIError {
  // eslint-disable-next-line require-jsdoc
  constructor(cause?: Error) {
    super("Not found error", "notFound", cause);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * A 'ValidationError' occurs when the data submitted from a form has issues.
 */
class ValidationError extends APIError {
  // eslint-disable-next-line require-jsdoc
  constructor(cause?: Error) {
    super(`${cause?.message || "Invalid input error"}`, "invalidInput", cause);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export {
  TechnicalError,
  RequestTimeoutError,
  InvalidPasswordError,
  UnauthorizedError,
  APIError,
  NotFoundError,
  ValidationError,
};
