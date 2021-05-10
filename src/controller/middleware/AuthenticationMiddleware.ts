import { Kind, Peek } from '@jamashita/anden-type';
import { Inject, Injectable, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Type } from '../../container/Types';
import { ILogger } from '../../infrastructure/ILogger';
import { IMiddleware } from './IMiddleware';

@Injectable()
export class AuthenticationMiddleware implements IMiddleware {
  private readonly logger: ILogger;

  public constructor(@Inject(Type.Logger) logger: ILogger) {
    this.logger = logger;
  }

  public use(@Req() req: FastifyRequest, @Res() res: FastifyReply, next: Peek): void {
    this.logger.debug('REQUEST');
    this.logger.trace(req);
    this.logger.debug('REPLY');
    this.logger.trace(res);

    if (Kind.isUndefined(req.session)) {
      this.logger.trace('SESSION IS NOT READY');

      this.logger.trace(res);
      res.send('OOO');
      // res.status(StatusCodes.UNAUTHORIZED).send();

      return;
    }

    next();
  }
}
