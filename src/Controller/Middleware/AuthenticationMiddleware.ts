import { NextFunction, Request, Response } from 'express';
import { UNAUTHORIZED } from 'http-status';
import { injectable } from 'inversify';

import { VeauAccount } from '../../VO/VeauAccount/VeauAccount';
import { IMiddleware } from './Interface/IMiddleware';

@injectable()
export class AuthenticationMiddleware implements IMiddleware {
  public use(req: Request, res: Response, next: NextFunction): void {
    if (req.user === undefined) {
      res.sendStatus(UNAUTHORIZED);

      return;
    }

    res.locals.account = req.user as VeauAccount;
    next();
  }
}
