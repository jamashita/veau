import { Response } from 'express';
import { Controller, Get, Res } from 'routing-controllers';

@Controller()
export class FEController {

  @Get('/robots.txt')
  public robot(@Res() res: Response): void {
    res.set('Content-Type', 'text/plain');
    res.send('User-Agent: *\nDisallow:');
  }

  @Get('*')
  public index(@Res() res: Response): void {
    res.render('index');
  }
}
