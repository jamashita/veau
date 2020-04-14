import express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import log4js from 'log4js';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { Stats } from '../../Entity/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { PageError } from '../../Error/PageError';
import { StatsError } from '../../Error/StatsError';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { DataSourceError } from '../../General/DataSourceError';
import { JSONable } from '../../General/Interface/JSONable';
import { Try } from '../../General/Try/Try';
import { StatsInteractor } from '../../Interactor/StatsInteractor';
import { Page } from '../../VO/Page';
import { StatsID } from '../../VO/StatsID';
import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);

router.get('/page/:page(\\d+)', authenticationMiddleware.requires(), async (req: express.Request, res: express.Response) => {
  return Page.of(Number(req.params.page)).match<Promise<void>>(async (page: Page) => {
    const trial: Try<JSONable, StatsOutlinesError | DataSourceError> = await statsInteractor.findByVeauAccountID(
      res.locals.account.getVeauAccountID(),
      page
    );

    trial.match<void>((outlines: JSONable) => {
      res.status(OK).send(outlines.toJSON());
    }, (err: StatsOutlinesError | DataSourceError) => {
      logger.fatal(err);

      res.sendStatus(INTERNAL_SERVER_ERROR);
    });
  }, (err: PageError) => {
    logger.fatal(err);

    res.sendStatus(BAD_REQUEST);

    return Promise.resolve();
  });
});

router.get('/:statsID([0-9a-f\-]{36})', async (req: express.Request, res: express.Response) => {
  const statsID: StatsID = StatsID.ofString(req.params.statsID).get();

  const trial: Try<JSONable, NoSuchElementError | StatsError | DataSourceError> = await statsInteractor.findByStatsID(statsID);

  trial.match<void>((stats: JSONable) => {
    res.status(OK).send(stats.toJSON());
  }, (err: NoSuchElementError | StatsError | DataSourceError) => {
    if (err instanceof NoSuchElementError) {
      logger.warn(err);

      res.sendStatus(NO_CONTENT);
      return;
    }

    logger.fatal(err);

    res.sendStatus(INTERNAL_SERVER_ERROR);
  });
});

router.post('/', authenticationMiddleware.requires(), (req: express.Request, res: express.Response) => {
  if (!Stats.isJSON(req.body)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  return Stats.ofJSON(req.body).match<Promise<void>>(async (stats: Stats) => {
    const trial: Try<unknown, DataSourceError> = await statsInteractor.save(
      stats,
      res.locals.account.getVeauAccountID()
    );

    trial.match<void>(() => {
      res.sendStatus(CREATED);
    }, (err: DataSourceError) => {
      logger.warn(err);

      res.sendStatus(BAD_REQUEST);
    });
  }, (err: StatsError) => {
    logger.warn(err);

    res.sendStatus(BAD_REQUEST);

    return Promise.resolve();
  });
});

export const StatsController: express.Router = router;
