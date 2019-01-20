import { Request, Response, Router } from 'express';

const router: Router = Router();

router.get('/robots.txt', (req: Request, res: Response) => {
  res.set('Content-Type', 'text/plain');
  res.send('User-Agent: *\nDisallow: /');
});

router.get('*', (req: Request, res: Response) => {
  res.render('index');
});

export const FE: Router = router;
