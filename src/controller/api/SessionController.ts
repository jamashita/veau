import { Controller, Delete, Inject, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
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
  public destroy(@Req() req: Request, @Res() res: Response): void {
    req.session.destroy(() => {
      this.logger.trace('CACHE DELETED');

      res.status(StatusCodes.OK).send();
    });
  }
}
