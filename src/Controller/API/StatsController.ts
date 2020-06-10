import { Response } from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { Body, Controller, Get, Param, Post, Res, UseBefore } from 'routing-controllers';

import { DataSourceError } from '@jamashita/publikum-error';
import { JSONable } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
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
  public list(@Param('page') pg: number, @Res() res: Response<unknown>): Promise<Response<unknown>> {
    return Page.of(pg).transform<Promise<Response<unknown>>>(
      async (page: Page) => {
        const superposition: Superposition<
          JSONable,
          StatsOutlinesError | DataSourceError
        > = await this.statsInteractor.findByVeauAccountID(res.locals.account.getVeauAccountID(), page);

        return superposition.transform<Response<unknown>>(
          (outlines: JSONable) => {
            return res.status(OK).send(outlines.toJSON());
          },
          (err: StatsOutlinesError | DataSourceError) => {
            logger.fatal(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
          }
        );
      },
      (err: PageError) => {
        logger.fatal(err);

        return Promise.resolve<Response<unknown>>(res.sendStatus(BAD_REQUEST));
      }
    );
  }

  @Get('/:statsID([0-9a-f-]{36})')
  @UseBefore(AuthenticationMiddleware)
  public refer(@Param('statsID') id: string, @Res() res: Response<unknown>): Promise<Response<unknown>> {
    return StatsID.ofString(id).transform<Promise<Response<unknown>>>(
      async (statsID: StatsID) => {
        const superposition: Superposition<
          JSONable,
          StatsError | NoSuchElementError | DataSourceError
        > = await this.statsInteractor.findByStatsID(statsID);

        return superposition.transform<Response<unknown>>(
          (stats: JSONable) => {
            return res.status(OK).send(stats.toJSON());
          },
          (err: StatsError | NoSuchElementError | DataSourceError) => {
            if (err instanceof NoSuchElementError) {
              logger.warn(err);

              return res.sendStatus(NO_CONTENT);
            }

            logger.fatal(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
          }
        );
      },
      (err: StatsIDError) => {
        logger.fatal(err);

        return Promise.resolve<Response<unknown>>(res.sendStatus(INTERNAL_SERVER_ERROR));
      }
    );
  }

  @Post('/')
  @UseBefore(AuthenticationMiddleware)
  public register(
    @Body({ required: true }) body: PlainObject,
    @Res() res: Response<unknown>
  ): Promise<Response<unknown>> {
    if (!Stats.isJSON(body)) {
      return Promise.resolve<Response<unknown>>(res.sendStatus(BAD_REQUEST));
    }

    return Stats.ofJSON(body).transform<Promise<Response<unknown>>>(
      async (stats: Stats) => {
        const superposition: Superposition<unknown, DataSourceError> = await this.statsInteractor.save(
          stats,
          res.locals.account.getVeauAccountID()
        );

        return superposition.transform<Response<unknown>>(
          () => {
            return res.sendStatus(CREATED);
          },
          (err: DataSourceError) => {
            logger.warn(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
          }
        );
      },
      (err: StatsError) => {
        logger.warn(err);

        return Promise.resolve<Response<unknown>>(res.sendStatus(BAD_REQUEST));
      }
    );
  }
}
