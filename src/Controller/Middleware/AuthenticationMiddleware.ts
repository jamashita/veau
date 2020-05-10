import { NextFunction, Request, Response } from 'express';
import { UNAUTHORIZED } from 'http-status';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { VeauAccount } from '../../VO/VeauAccount';

export class AuthenticationMiddleware implements ExpressMiddlewareInterface {

  public use(req: Request, res: Response, next: NextFunction): void {
    if (req.user === undefined) {
      res.sendStatus(UNAUTHORIZED);
      return;
    }

    res.locals.account = req.user as VeauAccount;
    next();
  }
}
