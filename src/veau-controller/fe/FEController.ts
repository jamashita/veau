import express from 'express';

const router: express.Router = express.Router();

router.get('/robots.txt', (req: express.Request, res: express.Response): void => {
  res.set('Content-Type', 'text/plain');
  res.send('User-Agent: *\nDisallow:');
});

router.get('*', (req: express.Request, res: express.Response): void => {
  res.render('index');
});

export const FEController: express.Router = router;
