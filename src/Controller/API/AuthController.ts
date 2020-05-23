import { Response } from 'express';
import { OK } from 'http-status';
import passport from 'passport';
import { Controller, Post, Res, UseBefore } from 'routing-controllers';

import { kernel } from '../../Container/Kernel';
import { Type } from '../../Container/Types';
import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
  Type.AuthenticationMiddleware
);

@Controller('/auth')
export class AuthController {
  @Post('/')
  @UseBefore(passport.authenticate('local'))
  @UseBefore(authenticationMiddleware.requires())
  public auth(@Res() res: Response<unknown>): Response<unknown> {
    return res.status(OK).send(res.locals.account.toJSON());
  }
}
