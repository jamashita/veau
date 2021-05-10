import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Type } from '../../container/Types';
import { VeauAccount } from '../../domain/vo/VeauAccount/VeauAccount';
import { ILogger } from '../../infrastructure/ILogger';

@Controller('accounts')
export class AccountController {
  private readonly logger: ILogger;

  public constructor(@Inject(Type.Logger) logger: ILogger) {
    this.logger = logger;
  }

  // TODO USE_ BEOFRE
  @Get('/')
  public inquire(@Req() req: FastifyRequest, @Res() res: FastifyReply): void {
    const account: VeauAccount = req.session.get('VEAU');

    this.logger.trace(account.getVeauAccountID().toString());

    res.status(StatusCodes.OK).send(account.toJSON());
  }
}
