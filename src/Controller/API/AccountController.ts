import { Response } from 'express';
import { OK } from 'http-status';
import { injectable } from 'inversify';
import { Controller, Get, Res, UseBefore } from 'routing-controllers';

import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

@injectable()
@Controller('/accounts')
@UseBefore(AuthenticationMiddleware)
export class AccountController {
  @Get('/')
  public inquire(@Res() res: Response<unknown>): Response<unknown> {
    return res.status(OK).send(res.locals.account.toJSON());
  }
}
