import * as express from 'express';
import { PRECONDITION_FAILED, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import * as log4js from 'log4js';
import { StatsJSON } from '../../veau-entity/Stats';
import { NoSuchElementError } from '../../veau-general/NoSuchElementError';
import { IStatsUsecase, StatsUsecase } from '../../veau-usecase/StatsUsecase';
import { UUID } from '../../veau-vo/UUID';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();
const statsUsecase: IStatsUsecase = StatsUsecase.getInstance();

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
    const stats: StatsJSON = await statsUsecase.findByStatsID(statsID)

    res.send(stats);
  }
  catch (err) {
    if (err instanceof NoSuchElementError) {
      res.sendStatus(NOT_FOUND);
      return;
    }

    logger.error(err.message);
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

export const Stats: express.Router = router;
