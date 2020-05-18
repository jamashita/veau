import { Request, Response } from 'express';
import { OK } from 'http-status';
import { Controller, Get, Req, Res, UseBefore } from 'routing-controllers';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
  TYPE.AuthenticationMiddleware
);

@Controller('/accounts')
@UseBefore(authenticationMiddleware.requires())
export class AccountController {
  @Get('/')
  public inquire(@Req() req: Request, @Res() res: Response): Response<unknown> {
    return res.status(OK).send(res.locals.account.toJSON());
  }
}
