import * as express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import * as log4js from 'log4js';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

router.get('/', (req: express.Request, res: express.Response) => {
  if (req.session) {
    req.session.destroy((err: any) => {
      if (err) {
        logger.error(err.toString());
        res.sendStatus(INTERNAL_SERVER_ERROR);
        return;
      }

      res.sendStatus(OK);
    });
    return;
  }

  logger.fatal('IT IS PROBABLY A KIND OF BUG');
  res.sendStatus(INTERNAL_SERVER_ERROR);
});

export const Destroy: express.Router = router;
