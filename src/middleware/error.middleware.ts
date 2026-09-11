import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { getEnv } from "../config/env.js";
import { AppError } from "../shared/errors/app-error.js";
import { ERROR_CODES } from "../shared/errors/error-codes.js";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Invalid request.",
        details: error.issues,
      },
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details ?? [],
      },
    });
    return;
  }

  if (getEnv().NODE_ENV !== "production") {
    console.error(error);
  }

  res.status(500).json({
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: "An unexpected error occurred.",
      details: [],
    },
  });
};
