import { Ambiguous, Kind, Peek } from '@jamashita/anden-type';
import { Injectable } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { VeauAccount } from '../../domain/vo/VeauAccount/VeauAccount';
import { IMiddleware } from './IMiddleware';

@Injectable()
export class AuthenticationMiddleware implements IMiddleware {
  public use(req: FastifyRequest, res: FastifyReply, next: Peek): void {
    const account: Ambiguous<VeauAccount> = req.session.get('VEAU');

    if (Kind.isUndefined(account)) {
      res.status(StatusCodes.UNAUTHORIZED);

      return;
    }

    next();
  }
}
