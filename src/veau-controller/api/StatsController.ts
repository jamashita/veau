import * as express from 'express';
import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, PRECONDITION_FAILED } from 'http-status';
import * as log4js from 'log4js';
import { RequestSession } from '../../declarations/RequestSession';
import { StatsJSON } from '../../veau-entity/Stats';
import { StatsOverviewJSON } from '../../veau-entity/StatsOverview';
import { NoSuchElementError } from '../../veau-general/NoSuchElementError';
import { IStatsUsecase } from '../../veau-usecase/IStatsUsecase';
import { StatsUsecase } from '../../veau-usecase/StatsUsecase';
import { UUID } from '../../veau-vo/UUID';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();
const statsUsecase: IStatsUsecase = StatsUsecase.getInstance();

router.get('/overview/:page(\\d+)', async (req: RequestSession, res: express.Response) => {
  const page: number = Number(req.params.page);

  if (isNaN(page)) {
    res.sendStatus(PRECONDITION_FAILED);
    return;
  }

  try {
    const statsOverviews: Array<StatsOverviewJSON> = await statsUsecase.findByVeauAccountID(req.user.getVeauAccountID(), page);

    res.send(statsOverviews);
  }
  catch (err) {
    logger.fatal(err.message);
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

router.get('/:statsID', async (req: express.Request, res: express.Response) => {
  const statsID: string = req.params.statsID;

  if (!statsID) {
    res.sendStatus(PRECONDITION_FAILED);
    return;
  }
  if (statsID.length !== UUID.size()) {
    res.sendStatus(PRECONDITION_FAILED);
    return;
  }

  try {
    const stats: StatsJSON = await statsUsecase.findByStatsID(statsID);

    res.send(stats);
  }
  catch (err) {
    if (err instanceof NoSuchElementError) {
      res.sendStatus(NOT_FOUND);
      return;
    }

    logger.fatal(err.message);
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

router.post('/', async (req: RequestSession, res: express.Response) => {
  const json: StatsJSON = req.body;

  try {
    await statsUsecase.save(req.user.getVeauAccountID(), json);
    res.sendStatus(CREATED);
  }
  catch (err) {
    logger.fatal(err.message);
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

router.post('/overview', async (req: RequestSession, res: express.Response) => {
  const json: StatsOverviewJSON = req.body;

  try {
    await statsUsecase.saveNewStats(req.user.getVeauAccountID(), json);
    res.sendStatus(CREATED);
  }
  catch (err) {
    logger.fatal(err.message);
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

export const StatsController: express.Router = router;
