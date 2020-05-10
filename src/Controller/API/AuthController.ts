import { Request, Response } from 'express';
import { OK } from 'http-status';
import passport from 'passport';
import { Controller, Post, Req, Res, UseBefore } from 'routing-controllers';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);

@Controller('/auth')
export class AuthController {

  @Post('/')
  @UseBefore(passport.authenticate('local'))
  @UseBefore(authenticationMiddleware.requires())
  public auth(@Req() req: Request, @Res() res: Response): Response<unknown> {
    return res.status(OK).send(res.locals.account.toJSON());
  }
}
