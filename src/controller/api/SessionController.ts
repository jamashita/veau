import { Controller, Delete, Inject, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Type } from '../../container/Types';
import { ILogger } from '../../infrastructure/ILogger';

@Controller('session')
export class SessionController {
  private readonly logger: ILogger;

  public constructor(@Inject(Type.Logger) logger: ILogger) {
    this.logger = logger;
  }

  @Delete('/')
  public destroy(@Req() req: FastifyRequest, @Res() res: FastifyReply): FastifyReply {
    req.session.delete();

    this.logger.trace('CACHE DELETED');

    return res.status(StatusCodes.OK).send();
  }
}
