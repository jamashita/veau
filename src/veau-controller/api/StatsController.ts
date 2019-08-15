import express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status';
import * as log4js from 'log4js';
import { StatsOutlines } from '../../veau-entity/collection/StatsOutlines';
import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { Type } from '../../veau-general/Type';
import { StatsInteractor } from '../../veau-interactor/StatsInteractor';
import { Page } from '../../veau-vo/Page';
import { StatsID } from '../../veau-vo/StatsID';
import { RequestSession } from '../RequestSession';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const statsInteractor: StatsInteractor = StatsInteractor.getInstance();

router.get('/page/:page(\\d+)', async (req: RequestSession, res: express.Response): Promise<any> => {
  if (req.user === undefined) {
    logger.fatal('ILLEGAL ACCESS');
    res.sendStatus(BAD_REQUEST);
    return;
  }

  const page: number = Number(req.params.page);

  if (page === 0) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  try {
    const statsOutlines: StatsOutlines = await statsInteractor.findByVeauAccountID(req.user.getVeauAccountID(), Page.of(page));

    res.status(OK).send(statsOutlines.toJSON());
  }
  catch (err) {
    logger.fatal(err.toString());
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

router.get('/:statsID([0-9a-f\-]{36})', async (req: express.Request, res: express.Response): Promise<any> => {
  const {
    statsID
  } = req.params;

  try {
    const stats: Stats = await statsInteractor.findByStatsID(StatsID.of(statsID));

    res.status(OK).send(stats.toJSON());
  }
  catch (err) {
    if (err instanceof NotFoundError) {
      res.sendStatus(NOT_FOUND);
      return;
    }

    logger.fatal(err.toString());
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

router.post('/', async (req: RequestSession, res: express.Response): Promise<any> => {
  if (req.user === undefined) {
    logger.fatal('ILLEGAL ACCESS');
    res.sendStatus(BAD_REQUEST);
    return;
  }

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

  if (!Type.isString(statsID)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isPlainObject(language)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isInteger(language.languageID)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isString(language.name)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isString(language.englishName)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isString(language.iso639)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isPlainObject(region)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isInteger(region.regionID)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isString(region.name)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isString(region.iso3166)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isInteger(termID)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isString(name)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isString(unit)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isDateString(updatedAt)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  if (!Type.isArray(items)) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  for (const item of items) {
    if (!Type.isString(item.statsItemID)) {
      res.sendStatus(BAD_REQUEST);
      return;
    }
    if (!Type.isString(item.name)) {
      res.sendStatus(BAD_REQUEST);
      return;
    }
    if (!Type.isArray(item.values)) {
      res.sendStatus(BAD_REQUEST);
      return;
    }

    for (const value of item.values) {
      if (!Type.isDateString(value.asOf)) {
        res.sendStatus(BAD_REQUEST);
        return;
      }
      if (!Type.isNumber(value.value)) {
        res.sendStatus(BAD_REQUEST);
        return;
      }
    }
  }

  const json: StatsJSON = req.body;
  const stats: Stats = Stats.fromJSON(json);

  try {
    await statsInteractor.save(stats, req.user.getVeauAccountID());
    res.sendStatus(CREATED);
  }
  catch (err) {
    logger.fatal(err.toString());
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

export const StatsController: express.Router = router;
