import { Request, Response } from 'express';
import { OK } from 'http-status';
import { Controller, Delete, Req, Res } from 'routing-controllers';

@Controller('/session')
export class SessionController {
  @Delete('/')
  public destroy(@Req() req: Request, @Res() res: Response<unknown>): Response<unknown> {
    req.logout();

    return res.sendStatus(OK);
  }
}
