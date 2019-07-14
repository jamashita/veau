import * as express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import * as log4js from 'log4js';
import { Locale } from '../../veau-entity/aggregate/Locale';
import { CacheError } from '../../veau-error/CacheError';
import { LocaleInteractor } from '../../veau-interactor/LocaleInteractor';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
const localeInteractor: LocaleInteractor = LocaleInteractor.getInstance();

router.get('/', async (req: express.Request, res: express.Response): Promise<any> => {
  const locale: Locale = await localeInteractor.all();

  res.status(OK).send(locale.toJSON());
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

    logger.fatal(err.message);
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

export const LocaleController: express.Router = router;
