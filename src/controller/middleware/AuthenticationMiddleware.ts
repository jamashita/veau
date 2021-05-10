import { Kind, Peek } from '@jamashita/anden-type';
import { Inject, Injectable, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Type } from '../../container/Types';
import { ILogger } from '../../infrastructure/ILogger';
import { IMiddleware } from './IMiddleware';

@Injectable()
export class AuthenticationMiddleware implements IMiddleware {
  private readonly logger: ILogger;

  public constructor(@Inject(Type.Logger) logger: ILogger) {
    this.logger = logger;
  }

  public use(@Req() req: Request, @Res() res: Response, next: Peek): void {
    // @ts-ignore
    if (Kind.isUndefined(req.session.account)) {
      this.logger.trace('SESSION IS NOT READY');

      res.status(StatusCodes.UNAUTHORIZED).send();

      return;
    }

    next();
  }
}
