import express from 'express';
import { UNAUTHORIZED } from 'http-status';

export class AuthenticationMiddleware {
  private static instance: AuthenticationMiddleware = new AuthenticationMiddleware();

  public static getInstance(): AuthenticationMiddleware {
    return AuthenticationMiddleware.instance;
  }

  private constructor() {
  }

  public apply(): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      if (req.user) {
        next();
        return;
      }

      res.sendStatus(UNAUTHORIZED);
    };
  }
}
