import { JSONable, PlainObject } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Body, Controller, Get, Param, Post, Res, UseBefore } from 'routing-controllers';
import { Type } from '../../container/Types';
import { Stats } from '../../domain/entity/Stats/Stats';
import { PageError } from '../../domain/vo/Page/error/PageError';
import { Page } from '../../domain/vo/Page/Page';
import { StatsError } from '../../domain/vo/StatsOutline/error/StatsError';
import { StatsOutlineError } from '../../domain/vo/StatsOutline/error/StatsOutlineError';
import { StatsID } from '../../domain/vo/StatsOutline/StatsID';
import { logger } from '../../infrastructure/Logger';
import { StatsInteractor } from '../../interactor/StatsInteractor';
import { NoSuchElementError } from '../../repository/query/error/NoSuchElementError';
import { AuthenticationMiddleware } from '../middleware/AuthenticationMiddleware';

@injectable()
@Controller('/stats')
export class StatsController {
  private readonly statsInteractor: StatsInteractor;

  public constructor(@inject(Type.StatsInteractor) statsInteractor: StatsInteractor) {
    this.statsInteractor = statsInteractor;
  }

  @Get('/page/:page(\\d+)')
  @UseBefore(AuthenticationMiddleware)
  public list(@Param('page') pg: number, @Res() res: Response): Promise<Response> {
    return Superposition.playground<Page, PageError>(() => {
      return Page.of(pg);
    }, PageError).map<JSONable, DataSourceError | PageError | StatsOutlineError>((page: Page) => {
      return this.statsInteractor.findByVeauAccountID(res.locals.account.getVeauAccountID(), page);
    }).map<Response, DataSourceError | PageError | StatsOutlineError>((outlines: JSONable) => {
      return res.status(StatusCodes.OK).send(outlines.toJSON());
    }).recover<Response, Error>((err: DataSourceError | PageError | StatsOutlineError) => {
      logger.fatal(err);

      if (err instanceof PageError) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
      }

      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }).get();
  }

  @Get('/:statsID([0-9a-f-]{36})')
  @UseBefore(AuthenticationMiddleware)
  public refer(@Param('statsID') id: string, @Res() res: Response): Promise<Response> {
    return Superposition.playground<StatsID, StatsError>(() => {
      return StatsID.ofString(id);
    }, StatsError).map<JSONable, DataSourceError | NoSuchElementError | StatsError>((statsID: StatsID) => {
      return this.statsInteractor.findByStatsID(statsID);
    }).map<Response, DataSourceError | NoSuchElementError | StatsError>((stats: JSONable) => {
      return res.status(StatusCodes.OK).send(stats.toJSON());
    }).recover<Response, Error>((err: DataSourceError | NoSuchElementError | StatsError) => {
      if (err instanceof NoSuchElementError) {
        logger.warn(err);

        return res.sendStatus(StatusCodes.NO_CONTENT);
      }

      logger.fatal(err);

      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }).get();
  }

  @Post('/')
  @UseBefore(AuthenticationMiddleware)
  public register(@Body({ required: true }) body: PlainObject, @Res() res: Response): Promise<Response> {
    return Superposition.playground<Stats, StatsError>(() => {
      if (!Stats.validate(body)) {
        throw new StatsError('StatsController.register()');
      }

      return Stats.ofJSON(body);
    }, StatsError).map<unknown, DataSourceError | StatsError>((stats: Stats) => {
      return this.statsInteractor.save(stats, res.locals.account.getVeauAccountID());
    }).map<Response, DataSourceError | StatsError>(() => {
      return res.sendStatus(StatusCodes.CREATED);
    }).recover<Response, Error>((err: DataSourceError | StatsError) => {
      logger.warn(err);

      if (err instanceof StatsError) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
      }

      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }).get();
  }
}