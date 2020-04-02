import express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import log4js from 'log4js';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { JSONable } from '../../veau-general/JSONable';
import { Try } from '../../veau-general/Try/Try';
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
    const trial: Try<void, CacheError> = await localeInteractor.delete();

    trial.match<void>(() => {
      res.sendStatus(OK);
    }, (err: CacheError) => {
      logger.error(err.message);
      res.sendStatus(INTERNAL_SERVER_ERROR);
    });
  }
  catch (err) {
    logger.fatal(err.toString());
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

export const LocaleController: express.Router = router;
