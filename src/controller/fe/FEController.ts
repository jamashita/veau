import { Controller, Get, Render, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Controller()
export class FEController {
  @Get('/?*')
  @Render('index')
  public render(): void {
    // NOOP
  }

  @Get('/robots.txt')
  public robot(@Res() res: FastifyReply): FastifyReply {
    res.header('Content-Type', 'text/plain');

    return res.send('User-Agent: *\nDisallow:');
  }
}
