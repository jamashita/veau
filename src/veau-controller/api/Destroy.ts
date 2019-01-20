import { Request, Response, Router } from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { getLogger, Logger } from 'log4js';

const router: Router = Router();
const logger: Logger = getLogger();

router.get('/', (req: Request, res: Response) => {
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

export const Destroy: Router = router;
