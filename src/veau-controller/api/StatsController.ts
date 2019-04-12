import * as express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, PRECONDITION_FAILED } from 'http-status';
import * as log4js from 'log4js';
import { StatsJSON } from '../../veau-entity/Stats';
import { StatsOverviewJSON } from '../../veau-entity/StatsOverview';
import { NoSuchElementError } from '../../veau-general/Error/NoSuchElementError';
import { RequestSession } from '../../veau-general/RequestSession';
import { IStatsUsecase } from '../../veau-usecase/interfaces/IStatsUsecase';
import { StatsUsecase } from '../../veau-usecase/StatsUsecase';
import { StatsID } from '../../veau-vo/StatsID';
import { UUID } from '../../veau-vo/UUID';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();
const statsUsecase: IStatsUsecase = StatsUsecase.getInstance();

router.get('/overview/:page(\\d+)', async (req: RequestSession, res: express.Response) => {
  const page: number = Number(req.params.page);

  if (page <= 0) {
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

router.get('/:statsID([0-9a-f\-]{36})', async (req: express.Request, res: express.Response) => {
  const {
    statsID
  } = req.params;

  try {
    const stats: StatsJSON = await statsUsecase.findByStatsID(StatsID.of(UUID.of(statsID)));

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
  const {
    statsID,
    language,
    region,
    termID,
    name,
    unit,
    updatedAt,
    items
  } = req.body;

  if (!statsID) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!language) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!region) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!termID) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!name) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!unit) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!updatedAt) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!items) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

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
  const {
    statsID,
    iso639,
    iso3166,
    termID,
    name,
    unit,
    updatedAt
  } = req.body;

  if (!statsID) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!iso639) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!iso3166) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!termID) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!name) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!unit) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!updatedAt) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

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
