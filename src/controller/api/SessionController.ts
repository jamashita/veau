import { Controller, Delete, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';

@Controller('session')
export class SessionController {
  @Delete('/')
  public destroy(@Req() req: FastifyRequest, @Res() res: FastifyReply): FastifyReply {
    req.session.delete();

    return res.status(StatusCodes.OK).send();
  }
}
