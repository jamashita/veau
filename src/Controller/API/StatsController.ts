import { DataSourceError } from '@jamashita/publikum-error';
import { JSONable } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { PlainObject } from '@jamashita/publikum-type';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Body, Controller, Get, Param, Post, Res, UseBefore } from 'routing-controllers';
import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { logger } from '../../Infrastructure/Logger';
import { StatsInteractor } from '../../Interactor/StatsInteractor';
import { NoSuchElementError } from '../../Query/Error/NoSuchElementError';
import { PageError } from '../../VO/Page/Error/PageError';
import { Page } from '../../VO/Page/Page';
import { StatsError } from '../../VO/StatsOutline/Error/StatsError';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

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
    }, PageError).map<JSONable, PageError | StatsOutlineError | PageError | DataSourceError>((page: Page) => {
      return this.statsInteractor.findByVeauAccountID(res.locals.account.getVeauAccountID(), page);
    }).map<Response, StatsOutlineError | PageError | DataSourceError>((outlines: JSONable) => {
      return res.status(StatusCodes.OK).send(outlines.toJSON());
    }).recover<Response, Error>((err: StatsOutlineError | PageError | DataSourceError) => {
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
    }, StatsError).map<JSONable, StatsError | NoSuchElementError | DataSourceError>((statsID: StatsID) => {
      return this.statsInteractor.findByStatsID(statsID);
    }).map<Response, StatsError | NoSuchElementError | DataSourceError>((stats: JSONable) => {
      return res.status(StatusCodes.OK).send(stats.toJSON());
    }).recover<Response, Error>((err: StatsError | NoSuchElementError | DataSourceError) => {
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
    }, StatsError).map<unknown, StatsError | DataSourceError>((stats: Stats) => {
      return this.statsInteractor.save(stats, res.locals.account.getVeauAccountID());
    }).map<Response, StatsError | DataSourceError>(() => {
      return res.sendStatus(StatusCodes.CREATED);
    }).recover<Response, Error>((err: StatsError | DataSourceError) => {
      logger.warn(err);

      if (err instanceof StatsError) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
      }

      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }).get();
  }
}
