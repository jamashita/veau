import { Router } from 'express';
import * as express from 'express';
import { Logger } from 'log4js';
import * as log4js from 'log4js';

const router: Router = Router();
const logger: Logger = log4js.getLogger();

router.get('/', (req: express.Request, res: express.Response) => {
  if (req.session) {
    req.session.destroy((err: any) => {
      if (err) {
        logger.error(err.toString());
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
    return;
  }

  logger.fatal('IT IS PROBABLY A KIND OF BUG');
  res.sendStatus(500);
});

export const Destroy = router;
