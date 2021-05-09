import { Controller, Get, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { VeauAccount } from '../../domain/vo/VeauAccount/VeauAccount';

@Controller('accounts')
export class AccountController {
  @Get('/')
  // TODO USE_ BEOFRE
  public inquire(@Req() req: FastifyReply, @Res() res: FastifyRequest): void {
    const account: VeauAccount = res.session.get('VEAU');

    req.status(StatusCodes.OK).send(account.toJSON());
  }
}
