/**
 * Custom error object, with a HTTP status code
 */
export class HttpError extends Error {
  status: number;
  constructor(message, code) {
    super(message);
    this.status = code;
  }
}

/**
 * Catch Errors Handler

 * With async/await, you need some way to catch errors
 * Instead of using try{} catch(e) {} in each controller, we wrap the function in
 * catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
 * @param fn
 */
export const catchErrors = fn => (req, res, next) =>
  fn(req, res, next).catch(next);

/**
 * Not Found Error Handler
 *
 * If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
 * @param req
 * @param res
 * @param next
 */
export const notFound = (req, res, next) => {
  const err = new HttpError("Not Found", 404);
  next(err);
};

/**
 * Development Error Handler
 *
 * In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
 * @param err
 * @param req
 * @param res
 */
export const developmentErrors = (err, req, res) => {
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack
      ? err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, "<mark>$&</mark>")
      : ""
  };
  res.status(err.status || 500).json({ errorDetails });
};

/**
 * Production Error Handler
 *
 * No stacktraces are leaked to user
 * @param err
 * @param req
 * @param res
 */
export const productionErrors = (err, req, res) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
};
