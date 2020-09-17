import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { Controller, Delete, Req, Res } from 'routing-controllers';

@injectable()
@Controller('/session')
export class SessionController {
  @Delete('/')
  public destroy(@Req() req: Request, @Res() res: Response): Response {
    req.logout();

    return res.sendStatus(StatusCodes.OK);
  }
}
