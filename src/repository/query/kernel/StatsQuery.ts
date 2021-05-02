import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { Stats } from '../../../domain/entity/Stats/Stats';
import { StatsItems } from '../../../domain/entity/StatsItem/StatsItems';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { Language } from '../../../domain/vo/Language/Language';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { Region } from '../../../domain/vo/Region/Region';
import { StatsItemError } from '../../../domain/vo/StatsItem/error/StatsItemError';
import { StatsError } from '../../../domain/vo/StatsOutline/error/StatsError';
import { StatsOutlineError } from '../../../domain/vo/StatsOutline/error/StatsOutlineError';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { StatsOutline } from '../../../domain/vo/StatsOutline/StatsOutline';
import { TermError } from '../../../domain/vo/Term/error/TermError';
import { Term } from '../../../domain/vo/Term/Term';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { ILanguageQuery } from '../interface/ILanguageQuery';
import { IRegionQuery } from '../interface/IRegionQuery';
import { IStatsItemQuery } from '../interface/IStatsItemQuery';
import { IStatsOutlineQuery } from '../interface/IStatsOutlineQuery';
import { IStatsQuery } from '../interface/IStatsQuery';
import { IKernelQuery } from './IKernelQuery';

@injectable()
export class StatsQuery implements IStatsQuery, IKernelQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Kernel' = 'Kernel';
  private readonly outlineQuery: IStatsOutlineQuery;
  private readonly itemQuery: IStatsItemQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;

  public constructor(
    @inject(Type.StatsOutlineMySQLQuery) outlineQuery: IStatsOutlineQuery,
    @inject(Type.StatsItemMySQLQuery) itemQuery: IStatsItemQuery,
    @inject(Type.LanguageKernelQuery) languageQuery: ILanguageQuery,
    @inject(Type.RegionKernelQuery) regionQuery: IRegionQuery
  ) {
    this.outlineQuery = outlineQuery;
    this.itemQuery = itemQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
  }

  public findByStatsID(statsID: StatsID): Superposition<Stats, DataSourceError | NoSuchElementError | StatsError> {
    return this.outlineQuery.find(statsID).map<Stats, DataSourceError | LanguageError | NoSuchElementError | RegionError | StatsItemError | StatsOutlineError | TermError>((outline: StatsOutline) => {
      return this.itemQuery.findByStatsID(statsID).map<Stats, DataSourceError | LanguageError | NoSuchElementError | RegionError | TermError>((items: StatsItems) => {
        return this.languageQuery.find(outline.getLanguageID()).map<Stats, DataSourceError | LanguageError | NoSuchElementError | RegionError | TermError>((language: Language) => {
          return this.regionQuery.find(outline.getRegionID()).map<Stats, DataSourceError | NoSuchElementError | RegionError | TermError>((region: Region) => {
            return Stats.of(
              outline,
              language,
              region,
              Term.ofTermID(outline.getTermID()),
              items
            );
          }, TermError);
        });
      });
    }).recover<Stats, DataSourceError | NoSuchElementError | StatsError>((err: DataSourceError | LanguageError | NoSuchElementError | RegionError | StatsItemError | StatsOutlineError | TermError) => {
      if (err instanceof NoSuchElementError || err instanceof DataSourceError) {
        throw err;
      }

      throw new StatsError('StatsQuery.findByStatsID()', err);
    }, StatsError, NoSuchElementError, DataSourceError);
  }
}
