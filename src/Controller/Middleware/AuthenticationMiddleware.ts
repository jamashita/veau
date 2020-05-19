import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UNAUTHORIZED } from 'http-status';
import { injectable } from 'inversify';

import { VeauAccount } from '../../VO/VeauAccount/VeauAccount';

@injectable()
export class AuthenticationMiddleware {
  public requires(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.user === undefined) {
        res.sendStatus(UNAUTHORIZED);
        return;
      }

      res.locals.account = req.user as VeauAccount;
      next();
    };
  }
}
