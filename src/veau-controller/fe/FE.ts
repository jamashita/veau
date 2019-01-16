import * as express from 'express';

const router = express.Router();

router.get('/robots.txt', (req: express.Request, res: express.Response) => {
  res.set('Content-Type', 'text/plain');
  res.send('User-Agent: *\nDisallow: /');
});

router.get('*', (req: express.Request, res: express.Response) => {
  res.render('index');
});

export const FE = router;
