import express from 'express';
import { UNAUTHORIZED } from 'http-status';

export class AuthenticatedMiddleware {
  private static instance: AuthenticatedMiddleware = new AuthenticatedMiddleware();

  public static getInstance(): AuthenticatedMiddleware {
    return AuthenticatedMiddleware.instance;
  }

  private constructor() {
  }

  public apply(): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction): any => {
      if (req.isAuthenticated()) {
        next();
        return;
      }

      res.sendStatus(UNAUTHORIZED);
    };
  }
}
