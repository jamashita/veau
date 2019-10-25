import express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import log4js from 'log4js';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { JSONable } from '../../veau-general/JSONable';
import { LocaleInteractor } from '../../veau-interactor/LocaleInteractor';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const authenticationMiddleware: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
const localeInteractor: LocaleInteractor = container.get<LocaleInteractor>(TYPE.LocaleInteractor);

router.get('/', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const locale: JSONable = await localeInteractor.all();

    res.status(OK).send(locale.toJSON());
  }
  catch (err) {
    logger.fatal(err.toString());
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

router.delete('/', authenticationMiddleware.requires(), async (req: express.Request, res: express.Response): Promise<void> => {
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
