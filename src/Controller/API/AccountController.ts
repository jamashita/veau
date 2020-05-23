import { Response } from 'express';
import { OK } from 'http-status';
import { Controller, Get, Res, UseBefore } from 'routing-controllers';

import { kernel } from '../../Container/Kernel';
import { Type } from '../../Container/Types';
import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
  Type.AuthenticationMiddleware
);

@Controller('/accounts')
@UseBefore(authenticationMiddleware.requires())
export class AccountController {
  @Get('/')
  public inquire(@Res() res: Response<unknown>): Response<unknown> {
    return res.status(OK).send(res.locals.account.toJSON());
  }
}
