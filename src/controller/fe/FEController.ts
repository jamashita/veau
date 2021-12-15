import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class FEController {
  @Get('/?*')
  @Render('index')
  public render(): void {
    // NOOP
  }

  @Get('/robots.txt')
  public robot(@Res() res: Response): void {
    res.header('Content-Type', 'text/plain');

    res.send('User-Agent: *\nDisallow:');
  }
}
