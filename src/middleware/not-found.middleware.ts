import type { RequestHandler } from "express";

import { AppError } from "../shared/errors/app-error.js";
import { ERROR_CODES } from "../shared/errors/error-codes.js";

export const notFoundMiddleware: RequestHandler = (req, _res, next) => {
  next(
    new AppError({
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      message: `Route ${req.method} ${req.originalUrl} was not found.`,
    }),
  );
};
