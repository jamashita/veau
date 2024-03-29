import { Noun } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Inject, Injectable } from '@nestjs/common';
import { Type } from '../container/Types';
import { Stats } from '../domain/entity/Stats/Stats';
import { Page } from '../domain/vo/Page/Page';
import { StatsError } from '../domain/vo/StatsOutline/error/StatsError';
import { StatsOutlineError } from '../domain/vo/StatsOutline/error/StatsOutlineError';
import { StatsID } from '../domain/vo/StatsOutline/StatsID';
import { StatsOutlines } from '../domain/vo/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../domain/vo/VeauAccount/VeauAccountID';
import { IStatsCommand } from '../repository/command/interface/IStatsCommand';
import { NoSuchElementError } from '../repository/query/error/NoSuchElementError';
import { IStatsOutlineQuery } from '../repository/query/interface/IStatsOutlineQuery';
import { IStatsQuery } from '../repository/query/interface/IStatsQuery';

@Injectable()
export class StatsInteractor implements Noun<'StatsInteractor'> {
  public readonly noun: 'StatsInteractor' = 'StatsInteractor';
  private readonly statsQuery: IStatsQuery;
  private readonly outlineQuery: IStatsOutlineQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
    @Inject(Type.StatsCaskQuery) statsQuery: IStatsQuery,
    @Inject(Type.StatsOutlineMySQLQuery) outlineQuery: IStatsOutlineQuery,
    @Inject(Type.StatsCaskCommand) statsCommand: IStatsCommand
  ) {
    this.statsQuery = statsQuery;
    this.outlineQuery = outlineQuery;
    this.statsCommand = statsCommand;
  }

  public findByStatsID(statsID: StatsID): Superposition<Stats, DataSourceError | NoSuchElementError | StatsError> {
    return this.statsQuery.findByStatsID(statsID);
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsOutlines, DataSourceError | StatsOutlineError> {
    return this.outlineQuery.findByVeauAccountID(veauAccountID, page);
  }

  public save(stats: Stats, veauAccountID: VeauAccountID): Superposition<unknown, DataSourceError> {
    return this.statsCommand.create(stats, veauAccountID);
  }
}
