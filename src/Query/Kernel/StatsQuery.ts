import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { inject, injectable } from 'inversify';

import { Type } from '../../Container/Types';
import { StatsError } from '../../Entity/Stats/Error/StatsError';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsItems } from '../../Entity/StatsItem/StatsItems';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { Language } from '../../VO/Language/Language';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { Region } from '../../VO/Region/Region';
import { StatsItemsError } from '../../VO/StatsItem/Error/StatsItemsError';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import { TermError } from '../../VO/Term/Error/TermError';
import { Term } from '../../VO/Term/Term';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IRegionQuery } from '../Interface/IRegionQuery';
import { IStatsItemQuery } from '../Interface/IStatsItemQuery';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';
import { IStatsQuery } from '../Interface/IStatsQuery';
import { IKernelQuery } from './Interface/IKernelQuery';

@injectable()
export class StatsQuery implements IStatsQuery, IKernelQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Kernel' = 'Kernel';
  private readonly statsOutlineQuery: IStatsOutlineQuery;
  private readonly statsItemQuery: IStatsItemQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;

  public constructor(
    @inject(Type.StatsOutlineMySQLQuery) statsOutlineQuery: IStatsOutlineQuery,
    @inject(Type.StatsItemMySQLQuery) statsItemQuery: IStatsItemQuery,
    @inject(Type.LanguageKernelQuery) languageQuery: ILanguageQuery,
    @inject(Type.RegionKernelQuery) regionQuery: IRegionQuery
  ) {
    this.statsOutlineQuery = statsOutlineQuery;
    this.statsItemQuery = statsItemQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
  }

  public findByStatsID(statsID: StatsID): Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> {
    return this.statsOutlineQuery.find(statsID).map<Stats,
      | StatsOutlineError
      | StatsItemsError
      | LanguageError
      | RegionError
      | TermError
      | NoSuchElementError
      | DataSourceError>((outline: StatsOutline) => {
      return this.statsItemQuery.findByStatsID(statsID).map<Stats, StatsItemsError | LanguageError | RegionError | TermError | NoSuchElementError | DataSourceError>(
        (items: StatsItems) => {
          return this.languageQuery.find(outline.getLanguageID()).map<Stats, LanguageError | RegionError | TermError | NoSuchElementError | DataSourceError>(
            (language: Language) => {
              return this.regionQuery.find(outline.getRegionID()).map<Stats, RegionError | TermError | NoSuchElementError | DataSourceError>((region: Region) => {
                return Term.ofTermID(outline.getTermID()).map<Stats, TermError>((term: Term) => {
                  return Stats.of(outline, language, region, term, items);
                });
              });
            }
          );
        }
      );
    }).recover<Stats, StatsError | NoSuchElementError | DataSourceError>(
      (
        err:
          | StatsOutlineError
          | StatsItemsError
          | LanguageError
          | RegionError
          | TermError
          | NoSuchElementError
          | DataSourceError
      ) => {
        if (err instanceof NoSuchElementError) {
          throw err;
        }
        if (err instanceof DataSourceError) {
          throw err;
        }

        throw new StatsError('StatsQuery.findByStatsID()', err);
      },
      StatsError,
      NoSuchElementError,
      DataSourceError
    );
  }
}
