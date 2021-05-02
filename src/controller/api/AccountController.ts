import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { Controller, Get, Res, UseBefore } from 'routing-controllers';
import { AuthenticationMiddleware } from '../middleware/AuthenticationMiddleware';

@injectable()
@Controller('/accounts')
export class AccountController {
  @Get('/')
  @UseBefore(AuthenticationMiddleware)
  public inquire(@Res() res: Response): Response {
    return res.status(StatusCodes.OK).send(res.locals.account.toJSON());
  }
}
