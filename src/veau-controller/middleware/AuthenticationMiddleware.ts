import * as express from 'express';
import { UNAUTHORIZED } from 'http-status';

export const AuthenticationMiddleware: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.user) {
    next();
    return;
  }

  res.sendStatus(UNAUTHORIZED);
};
