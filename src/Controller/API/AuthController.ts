import { Response } from 'express';
import { OK } from 'http-status';
import passport from 'passport';
import { Controller, Post, Res, UseBefore } from 'routing-controllers';

import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

@Controller('/auth')
export class AuthController {
  @Post('/')
  @UseBefore(passport.authenticate('local'))
  @UseBefore(AuthenticationMiddleware)
  public auth(@Res() res: Response<unknown>): Response<unknown> {
    return res.status(OK).send(res.locals.account.toJSON());
  }
}
