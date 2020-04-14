import express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import log4js from 'log4js';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { JSONable } from '../../General/Interface/JSONable';
import { Try } from '../../General/Try/Try';
import { LocaleInteractor } from '../../Interactor/LocaleInteractor';
import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);

router.get('/', async (req: express.Request, res: express.Response) => {
  const trial: Try<JSONable, NoSuchElementError | DataSourceError> = await localeInteractor.all();

  trial.match<void>((locale: JSONable) => {
    res.status(OK).send(locale.toJSON());
  }, (err: NoSuchElementError | DataSourceError) => {
    logger.error(err);

    res.sendStatus(INTERNAL_SERVER_ERROR);
  });
});

router.delete('/', authenticationMiddleware.requires(), async (req: express.Request, res: express.Response) => {
  const trial: Try<void, DataSourceError> = await localeInteractor.delete();

  trial.match<void>(() => {
    res.sendStatus(OK);
  }, (err: DataSourceError) => {
    logger.error(err);

    res.sendStatus(INTERNAL_SERVER_ERROR);
  });
});

export const LocaleController: express.Router = router;
