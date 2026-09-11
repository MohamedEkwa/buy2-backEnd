import type { RequestHandler } from "express";

import type { ValidationSchema } from "../shared/types/express.js";

export function validate(schema: ValidationSchema): RequestHandler {
  return (req, _res, next) => {
    const body = schema.body?.parse(req.body);
    const params = schema.params?.parse(req.params);
    const query = schema.query?.parse(req.query);
    const headers = schema.headers?.parse(req.headers);

    req.validated = { body, params, query, headers };
    next();
  };
}
