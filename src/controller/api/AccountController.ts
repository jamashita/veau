import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
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
  public inquire(@Req() req: Request, @Res() res: Response): void {
    // TODO ACCOUNT
    // @ts-ignore
    const account: VeauAccount = req.session.account;
    this.logger.debug(account);

    this.logger.trace(account.getVeauAccountID().toString());

    res.status(StatusCodes.OK).send(account.toJSON());
  }
}
