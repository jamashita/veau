import { Response } from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { Body, Controller, Get, Param, Post, Res, UseBefore } from 'routing-controllers';

import { DataSourceError } from '@jamashita/publikum-error';
import { JSONable } from '@jamashita/publikum-interface';
import { PlainObject } from '@jamashita/publikum-type';

import { Type } from '../../Container/Types';
import { StatsError } from '../../Entity/Stats/Error/StatsError';
import { Stats } from '../../Entity/Stats/Stats';
import { logger } from '../../Infrastructure/Logger';
import { StatsInteractor } from '../../Interactor/StatsInteractor';
import { NoSuchElementError } from '../../Query/Error/NoSuchElementError';
import { PageError } from '../../VO/Page/Error/PageError';
import { Page } from '../../VO/Page/Page';
import { StatsIDError } from '../../VO/StatsOutline/Error/StatsIDError';
import { StatsOutlinesError } from '../../VO/StatsOutline/Error/StatsOutlinesError';
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
    return Page.of(pg)
      .map<Response, PageError | StatsOutlinesError | DataSourceError>(
        (page: Page) => {
          return this.statsInteractor
            .findByVeauAccountID(res.locals.account.getVeauAccountID(), page)
            .map<Response, StatsOutlinesError | DataSourceError>((outlines: JSONable) => {
              return res.status(OK).send(outlines.toJSON());
            });
        },
        StatsOutlinesError,
        DataSourceError
      )
      .recover<Response, Error>((err: PageError | StatsOutlinesError | DataSourceError) => {
        logger.fatal(err);

        if (err instanceof PageError) {
          return res.sendStatus(BAD_REQUEST);
        }

        return res.sendStatus(INTERNAL_SERVER_ERROR);
      })
      .get();
  }

  @Get('/:statsID([0-9a-f-]{36})')
  @UseBefore(AuthenticationMiddleware)
  public refer(@Param('statsID') id: string, @Res() res: Response): Promise<Response> {
    return StatsID.ofString(id)
      .map<Response, StatsIDError | StatsError | NoSuchElementError | DataSourceError>(
        (statsID: StatsID) => {
          return this.statsInteractor
            .findByStatsID(statsID)
            .map<Response, StatsError | NoSuchElementError | DataSourceError>((stats: JSONable) => {
              return res.status(OK).send(stats.toJSON());
            });
        },
        StatsError,
        NoSuchElementError,
        DataSourceError
      )
      .recover<Response, Error>((err: StatsIDError | StatsError | NoSuchElementError | DataSourceError) => {
        if (err instanceof NoSuchElementError) {
          logger.warn(err);

          return res.sendStatus(NO_CONTENT);
        }

        logger.fatal(err);

        return res.sendStatus(INTERNAL_SERVER_ERROR);
      })
      .get();
  }

  @Post('/')
  @UseBefore(AuthenticationMiddleware)
  public register(@Body({ required: true }) body: PlainObject, @Res() res: Response): Promise<Response> {
    return Stats.ofObject(body)
      .map<Response, StatsError | DataSourceError>((stats: Stats) => {
        return this.statsInteractor
          .save(stats, res.locals.account.getVeauAccountID())
          .map<Response, DataSourceError>(() => {
            return res.sendStatus(CREATED);
          });
      }, DataSourceError)
      .recover<Response, Error>((err: StatsError | DataSourceError) => {
        logger.warn(err);

        if (err instanceof StatsError) {
          return res.sendStatus(BAD_REQUEST);
        }

        return res.sendStatus(INTERNAL_SERVER_ERROR);
      })
      .get();
  }
}
