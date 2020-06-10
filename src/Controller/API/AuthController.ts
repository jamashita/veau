import { Response } from 'express';
import { OK } from 'http-status';
import { injectable } from 'inversify';
import passport from 'passport';
import { Controller, Post, Res, UseBefore } from 'routing-controllers';

@injectable()
@Controller('/auth')
export class AuthController {
  @Post('/')
  @UseBefore(passport.authenticate('local'))
  public auth(@Res() res: Response): Response {
    return res.status(OK).send(res.locals.account.toJSON());
  }
}
