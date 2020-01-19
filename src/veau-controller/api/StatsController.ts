import express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status';
import log4js from 'log4js';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { JSONable } from '../../veau-general/JSONable';
import { PlainObject } from '../../veau-general/Type/PlainObject';
import { Type } from '../../veau-general/Type/Type';
import { StatsInteractor } from '../../veau-interactor/StatsInteractor';
import { Page } from '../../veau-vo/Page';
import { StatsID } from '../../veau-vo/StatsID';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const authenticationMiddleware: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
const statsInteractor: StatsInteractor = container.get<StatsInteractor>(TYPE.StatsInteractor);

router.get('/page/:page(\\d+)', authenticationMiddleware.requires(), async (req: express.Request, res: express.Response): Promise<void> => {
  const page: number = Number(req.params.page);

  if (page === 0) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  try {
    const statsOutlines: JSONable = await statsInteractor.findByVeauAccountID(res.locals.account.getVeauAccountID(), Page.of(page));

    res.status(OK).send(statsOutlines.toJSON());
  }
  catch (err) {
    logger.fatal(err.toString());
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

router.get('/:statsID([0-9a-f\-]{36})', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const stats: JSONable = await statsInteractor.findByStatsID(StatsID.of(req.params.statsID));

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

router.post('/', authenticationMiddleware.requires(), async (req: express.Request, res: express.Response): Promise<void> => {
  const {
    statsID,
    language,
    region,
    termID,
    name,
    unit,
    updatedAt,
    items
  }: PlainObject = req.body;

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
    if (!Type.isPlainObject(item)) {
      res.sendStatus(BAD_REQUEST);
      return;
    }
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
      if (!Type.isPlainObject(value)) {
        res.sendStatus(BAD_REQUEST);
        return;
      }
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
  const stats: Stats = Stats.ofJSON(json);

  try {
    await statsInteractor.save(stats, res.locals.account.getVeauAccountID());

    res.sendStatus(CREATED);
  }
  catch (err) {
    logger.fatal(err.toString());
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

export const StatsController: express.Router = router;
