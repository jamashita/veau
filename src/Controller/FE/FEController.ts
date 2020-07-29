import { Response } from 'express';
import { injectable } from 'inversify';
import { Controller, Get, Render, Res } from 'routing-controllers';

@injectable()
@Controller()
export class FEController {
  @Get('/robots.txt')
  public robot(@Res() res: Response): Response {
    res.set('Content-Type', 'text/plain');

    return res.send('User-Agent: *\nDisallow:');
  }

  @Get('*')
  @Render('index')
  public render(): void {
    // NOOP
  }
}
