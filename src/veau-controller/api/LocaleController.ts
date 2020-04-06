import express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import log4js from 'log4js';
import { kernel } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { JSONable } from '../../veau-general/JSONable';
import { Try } from '../../veau-general/Try/Try';
import { LocaleInteractor } from '../../veau-interactor/LocaleInteractor';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);

router.get('/', async (req: express.Request, res: express.Response) => {
  const trial: Try<JSONable, NoSuchElementError> = await localeInteractor.all();

  trial.match<void>((locale: JSONable) => {
    res.status(OK).send(locale.toJSON());
  }, (err: NoSuchElementError) => {
    logger.error(err.message);

    res.sendStatus(INTERNAL_SERVER_ERROR);
  });
});

router.delete('/', authenticationMiddleware.requires(), async (req: express.Request, res: express.Response) => {
  const trial: Try<void, CacheError | DataSourceError> = await localeInteractor.delete();

  trial.match<void>(() => {
    res.sendStatus(OK);
  }, (err: CacheError | DataSourceError) => {
    logger.error(err.message);

    res.sendStatus(INTERNAL_SERVER_ERROR);
  });
});

export const LocaleController: express.Router = router;
