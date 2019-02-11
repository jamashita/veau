import * as express from 'express';
import { UNAUTHORIZED } from 'http-status';
import { IMiddleware } from './IMiddleware';

export class AuthenticationMiddleware implements IMiddleware {
  private static instance: AuthenticationMiddleware = new AuthenticationMiddleware();

  public static getInstance(): AuthenticationMiddleware {
    return AuthenticationMiddleware.instance;
  }

  private constructor() {
  }

  public middleware(req: express.Request, res: express.Response, next: express.NextFunction): any {
    if (req.user) {
      next();
      return;
    }

    res.sendStatus(UNAUTHORIZED);
  }
}
