import { Request, Response } from 'express';
import { OK } from 'http-status';
import { Controller, Delete, Req, Res } from 'routing-controllers';

@Controller('/destroy')
export class DestroyController {

  @Delete('/')
  public delete(@Req()req: Request, @Res() res: Response): void {
    req.logout();
    res.sendStatus(OK);
  }
}
