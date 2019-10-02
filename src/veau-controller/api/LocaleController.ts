import express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import log4js from 'log4js';
import { CacheError } from '../../veau-error/CacheError';
import { JSONable } from '../../veau-general/JSONable';
import { LocaleInteractor } from '../../veau-interactor/LocaleInteractor';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
const localeInteractor: LocaleInteractor = LocaleInteractor.getInstance();

router.get('/', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const locale: JSONable = await localeInteractor.all();

    res.status(OK).send(locale.toJSON());
  }
  catch (err) {
    logger.fatal(err.toString());
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

router.delete('/', authenticationMiddleware.apply(), async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    await localeInteractor.delete();

    res.sendStatus(OK);
  }
  catch (err) {
    if (err instanceof CacheError) {
      logger.error(err.message);
      res.sendStatus(INTERNAL_SERVER_ERROR);
      return;
    }

    logger.fatal(err.toString());
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

export const LocaleController: express.Router = router;
