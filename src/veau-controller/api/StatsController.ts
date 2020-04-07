import express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import log4js from 'log4js';
import { kernel } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { Stats } from '../../veau-entity/Stats';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { PageError } from '../../veau-error/PageError';
import { StatsError } from '../../veau-error/StatsError';
import { StatsOutlinesError } from '../../veau-error/StatsOutlinesError';
import { JSONable } from '../../veau-general/JSONable';
import { Try } from '../../veau-general/Try/Try';
import { StatsInteractor } from '../../veau-interactor/StatsInteractor';
import { Page } from '../../veau-vo/Page';
import { StatsID } from '../../veau-vo/StatsID';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);

router.get('/page/:page(\\d+)', authenticationMiddleware.requires(), async (req: express.Request, res: express.Response) => {
  await Page.of(Number(req.params.page)).match<Promise<void>>(async (page: Page) => {
    const trial: Try<JSONable, StatsOutlinesError> = await statsInteractor.findByVeauAccountID(res.locals.account.getVeauAccountID(), page);

    trial.match<void>((outlines: JSONable) => {
      res.status(OK).send(outlines.toJSON());
    }, (err: StatsOutlinesError) => {
      logger.fatal(err.message);

      res.sendStatus(INTERNAL_SERVER_ERROR);
    });
  }, (err: PageError) => {
    logger.fatal(err.message);

    res.sendStatus(BAD_REQUEST);

    return Promise.resolve<void>(undefined);
  });
});

router.get('/:statsID([0-9a-f\-]{36})', async (req: express.Request, res: express.Response) => {
  const statsID: StatsID = StatsID.ofString(req.params.statsID).get();

  const trial: Try<JSONable, NotFoundError | StatsError> = await statsInteractor.findByStatsID(statsID);

  trial.match<void>((stats: JSONable) => {
    res.status(OK).send(stats.toJSON());
  }, (err: NotFoundError | StatsError) => {
    if (err instanceof StatsError) {
      logger.fatal(err.message);

      res.sendStatus(INTERNAL_SERVER_ERROR);
      return;
    }

    logger.warn(err.message);

    res.sendStatus(NO_CONTENT);
  });
});

router.post('/', authenticationMiddleware.requires(), async (req: express.Request, res: express.Response) => {
  if (!Stats.isJSON(req.body)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  await Stats.ofJSON(req.body).match<Promise<void>>(async (stats: Stats) => {
    await statsInteractor.save(stats, res.locals.account.getVeauAccountID());

    res.sendStatus(CREATED);
  }, (err: StatsError) => {
    logger.warn(err.message);

    res.sendStatus(BAD_REQUEST);

    return Promise.resolve<void>(undefined);
  });
});

export const StatsController: express.Router = router;
