import * as express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import * as log4js from 'log4js';
import { RequestSession } from '../../declarations/RequestSession';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

router.get('/', (req: RequestSession, res: express.Response) => {
  req.session.destroy((err: any) => {
    if (err) {
      logger.error(err.toString());
      res.sendStatus(INTERNAL_SERVER_ERROR);
      return;
    }

    res.sendStatus(OK);
  })
});

export const DestroyController: express.Router = router;
