import { JSONable, PlainObject } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Body, Controller, Get, Inject, Param, Post, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Type } from '../../container/Types';
import { Stats } from '../../domain/entity/Stats/Stats';
import { PageError } from '../../domain/vo/Page/error/PageError';
import { Page } from '../../domain/vo/Page/Page';
import { StatsError } from '../../domain/vo/StatsOutline/error/StatsError';
import { StatsOutlineError } from '../../domain/vo/StatsOutline/error/StatsOutlineError';
import { StatsID } from '../../domain/vo/StatsOutline/StatsID';
import { VeauAccount } from '../../domain/vo/VeauAccount/VeauAccount';
import { ILogger } from '../../infrastructure/ILogger';
import { StatsInteractor } from '../../interactor/StatsInteractor';
import { NoSuchElementError } from '../../repository/query/error/NoSuchElementError';

@Controller('stats')
export class StatsController {
  private readonly statsInteractor: StatsInteractor;
  private readonly logger: ILogger;

  public constructor(
    @Inject(Type.StatsInteractor) statsInteractor: StatsInteractor,
    @Inject(Type.Logger) logger: ILogger
  ) {
    this.statsInteractor = statsInteractor;
    this.logger = logger;
  }

  @Get('/page/:page(\\d+)')
  // TODO USE BEFORE
  public list(@Param('page') pg: number, @Req() req: FastifyRequest, @Res() res: FastifyReply): void {
    Superposition.playground<Page, PageError>(() => {
      return Page.of(pg);
    }, PageError).map<JSONable, DataSourceError | PageError | StatsOutlineError>((page: Page) => {
      const account: VeauAccount = req.session.get('VEAU');

      return this.statsInteractor.findByVeauAccountID(account.getVeauAccountID(), page);
    }).map<void, DataSourceError | PageError | StatsOutlineError>((outlines: JSONable) => {
      res.status(StatusCodes.OK).send(outlines.toJSON());
    }).recover<void, Error>((err: DataSourceError | PageError | StatsOutlineError) => {
      this.logger.fatal(err);

      if (err instanceof PageError) {
        res.status(StatusCodes.BAD_REQUEST).send();

        return;
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    });
  }

  @Get('/:statsID([0-9a-f-]{36})')
  // TODO USE BEDORE
  public refer(@Param('statsID') id: string, @Res() res: FastifyReply): void {
    Superposition.playground<StatsID, StatsError>(() => {
      return StatsID.ofString(id);
    }, StatsError).map<JSONable, DataSourceError | NoSuchElementError | StatsError>((statsID: StatsID) => {
      return this.statsInteractor.findByStatsID(statsID);
    }).map<void, DataSourceError | NoSuchElementError | StatsError>((stats: JSONable) => {
      res.status(StatusCodes.OK).send(stats.toJSON());
    }).recover<void, Error>((err: DataSourceError | NoSuchElementError | StatsError) => {
      if (err instanceof NoSuchElementError) {
        this.logger.warn(err);

        res.status(StatusCodes.NO_CONTENT).send();

        return;
      }
      this.logger.fatal(err);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    });
  }

  @Post('/')
  // TODO USE BEFORE
  public register(@Body() body: PlainObject, @Req() req: FastifyRequest, @Res() res: FastifyReply): void {
    Superposition.playground<Stats, StatsError>(() => {
      if (!Stats.validate(body)) {
        throw new StatsError('StatsController.register()');
      }

      return Stats.ofJSON(body);
    }, StatsError).map<unknown, DataSourceError | StatsError>((stats: Stats) => {
      const account: VeauAccount = req.session.get('VEAU');

      return this.statsInteractor.save(stats, account.getVeauAccountID());
    }).map<void, DataSourceError | StatsError>(() => {
      res.status(StatusCodes.CREATED).send();
    }).recover<void, Error>((err: DataSourceError | StatsError) => {
      this.logger.warn(err);

      if (err instanceof StatsError) {
        res.status(StatusCodes.BAD_REQUEST).send();

        return;
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    });
  }
}
