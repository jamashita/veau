import express from 'express';
import { UNAUTHORIZED } from 'http-status';
import { injectable } from 'inversify';
import { VeauAccount } from '../../veau-vo/VeauAccount';

@injectable()
export class AuthenticationMiddleware {

  public requires(): express.RequestHandler {

    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.user === undefined) {
        res.sendStatus(UNAUTHORIZED);
        return;
      }

      res.locals.account = req.user as VeauAccount;
      next();
    };
  }
}
