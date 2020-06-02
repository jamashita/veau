import { Response } from 'express';
import { OK } from 'http-status';
import { Controller, Get, Res, UseBefore } from 'routing-controllers';

import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

@Controller('/accounts')
@UseBefore(AuthenticationMiddleware)
export class AccountController {
  @Get('/')
  public inquire(@Res() res: Response<unknown>): Response<unknown> {
    return res.status(OK).send(res.locals.account.toJSON());
  }
}
