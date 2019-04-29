import * as express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, PRECONDITION_FAILED } from 'http-status';
import * as log4js from 'log4js';
import { StatsJSON } from '../../veau-entity/Stats';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { RequestSession } from '../../veau-general/RequestSession';
import { StatsUseCase } from '../../veau-usecase/StatsUseCase';
import { StatsID } from '../../veau-vo/StatsID';
import { UUID } from '../../veau-vo/UUID';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const statsUseCase: StatsUseCase = StatsUseCase.getInstance();

router.get('/page/:page(\\d+)', async (req: RequestSession, res: express.Response) => {
  const page: number = Number(req.params.page);

  if (page <= 0) {
    res.sendStatus(PRECONDITION_FAILED);
    return;
  }

  try {
    const stats: Array<StatsJSON> = await statsUseCase.findByVeauAccountID(req.user.getVeauAccountID(), page);

    res.send(stats);
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
    const stats: StatsJSON = await statsUseCase.findByStatsID(StatsID.of(UUID.of(statsID)));

    res.send(stats);
  }
  catch (err) {
    if (err instanceof NotFoundError) {
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

  if (statsID === undefined) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (language === undefined) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (region === undefined) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (termID === undefined) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (name === undefined) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (unit === undefined) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (updatedAt === undefined) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (items === undefined) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  const json: StatsJSON = req.body;

  try {
    await statsUseCase.save(req.user.getVeauAccountID(), json);
    res.sendStatus(CREATED);
  }
  catch (err) {
    logger.fatal(err.message);
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

export const StatsController: express.Router = router;
