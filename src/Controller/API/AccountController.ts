import { Response } from 'express';
import { OK } from 'http-status';
import { injectable } from 'inversify';
import { Controller, Get, Res, UseBefore } from 'routing-controllers';

import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

@injectable()
@Controller('/accounts')
export class AccountController {
  @Get('/')
  @UseBefore(AuthenticationMiddleware)
  public inquire(@Res() res: Response): Response {
    return res.status(OK).send(res.locals.account.toJSON());
  }
}
