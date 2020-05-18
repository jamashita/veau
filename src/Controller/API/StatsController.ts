import { Response } from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import log4js from 'log4js';
import { DataSourceError, JSONable, PlainObject, Superposition } from 'publikum';
import { Body, Controller, Get, Param, Post, Res, UseBefore } from 'routing-controllers';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { Stats } from '../../Entity/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { PageError } from '../../Error/PageError';
import { StatsError } from '../../Error/StatsError';
import { StatsIDError } from '../../Error/StatsIDError';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { StatsInteractor } from '../../Interactor/StatsInteractor';
import { Page } from '../../VO/Page';
import { StatsID } from '../../VO/StatsID';
import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

const logger: log4js.Logger = log4js.getLogger();

const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
  TYPE.AuthenticationMiddleware
);
const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);

@Controller('/stats')
export class StatsController {
  @Get('/page/:page(\\d+)')
  @UseBefore(authenticationMiddleware.requires())
  public list(@Param('page') pg: number, @Res() res: Response): Promise<Response<unknown>> {
    return Page.of(pg).match<Promise<Response<unknown>>>(
      async (page: Page) => {
        const superposition: Superposition<
          JSONable,
          StatsOutlinesError | DataSourceError
        > = await statsInteractor.findByVeauAccountID(res.locals.account.getVeauAccountID(), page);

        return superposition.match<Response<unknown>>(
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
  @UseBefore(authenticationMiddleware.requires())
  public refer(@Param('statsID') id: string, @Res() res: Response): Promise<Response<unknown>> {
    return StatsID.ofString(id).match<Promise<Response<unknown>>>(
      async (statsID: StatsID) => {
        const superposition: Superposition<
          JSONable,
          StatsError | NoSuchElementError | DataSourceError
        > = await statsInteractor.findByStatsID(statsID);

        return superposition.match<Response<unknown>>(
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
  @UseBefore(authenticationMiddleware.requires())
  public register(@Body() body: PlainObject, @Res() res: Response): Promise<Response<unknown>> {
    if (!Stats.isJSON(body)) {
      return Promise.resolve<Response<unknown>>(res.sendStatus(BAD_REQUEST));
    }

    return Stats.ofJSON(body).match<Promise<Response<unknown>>>(
      async (stats: Stats) => {
        const superposition: Superposition<void, DataSourceError> = await statsInteractor.save(
          stats,
          res.locals.account.getVeauAccountID()
        );

        return superposition.match<Response<unknown>>(
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
