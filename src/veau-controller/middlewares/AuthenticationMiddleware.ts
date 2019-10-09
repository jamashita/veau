import express from 'express';
import { UNAUTHORIZED } from 'http-status';
import { VeauAccount } from '../../veau-entity/VeauAccount';

export class AuthenticationMiddleware {
  private static instance: AuthenticationMiddleware = new AuthenticationMiddleware();

  public static getInstance(): AuthenticationMiddleware {
    return AuthenticationMiddleware.instance;
  }

  private constructor() {
  }

  public requires(): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      if (req.user !== undefined) {
        res.locals.account = req.user as VeauAccount;
        next();
        return;
      }

      res.sendStatus(UNAUTHORIZED);
    };
  }
}
