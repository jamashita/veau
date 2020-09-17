import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import passport from 'passport';
import { Controller, Post, Res, UseBefore } from 'routing-controllers';
import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

@injectable()
@Controller('/auth')
export class AuthController {
  @Post('/')
  @UseBefore(AuthenticationMiddleware)
  @UseBefore(passport.authenticate('local'))
  public auth(@Res() res: Response): Response {
    return res.status(StatusCodes.OK).send(res.locals.account.toJSON());
  }
}
