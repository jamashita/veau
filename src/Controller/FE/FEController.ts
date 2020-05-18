import { Response } from 'express';
import { Controller, Get, Render, Res } from 'routing-controllers';

@Controller()
export class FEController {
  @Get('/robots.txt')
  public robot(@Res() res: Response): Response<unknown> {
    res.set('Content-Type', 'text/plain');
    return res.send('User-Agent: *\nDisallow:');
  }

  @Get('*')
  @Render('index')
  public render(): void {
    // NOOP
  }
}
