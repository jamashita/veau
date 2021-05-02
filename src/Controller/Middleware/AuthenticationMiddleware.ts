import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { VeauAccount } from '../../domain/VO/VeauAccount/VeauAccount';
import { IMiddleware } from './Interface/IMiddleware';

@injectable()
export class AuthenticationMiddleware implements IMiddleware {
  public use(req: Request, res: Response, next: NextFunction): void {
    if (req.user === undefined) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);

      return;
    }

    res.locals.account = req.user as VeauAccount;
    next();
  }
}
