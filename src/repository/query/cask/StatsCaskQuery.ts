import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { Stats } from '../../../domain/entity/Stats/Stats.js';
import { StatsItems } from '../../../domain/entity/StatsItem/StatsItems.js';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError.js';
import { Language } from '../../../domain/vo/Language/Language.js';
import { RegionError } from '../../../domain/vo/Region/error/RegionError.js';
import { Region } from '../../../domain/vo/Region/Region.js';
import { StatsItemError } from '../../../domain/vo/StatsItem/error/StatsItemError.js';
import { StatsError } from '../../../domain/vo/StatsOutline/error/StatsError.js';
import { StatsOutlineError } from '../../../domain/vo/StatsOutline/error/StatsOutlineError.js';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID.js';
import { StatsOutline } from '../../../domain/vo/StatsOutline/StatsOutline.js';
import { TermError } from '../../../domain/vo/Term/error/TermError.js';
import { Term } from '../../../domain/vo/Term/Term.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { ILanguageQuery } from '../ILanguageQuery.js';
import { IRegionQuery } from '../IRegionQuery.js';
import { IStatsItemQuery } from '../IStatsItemQuery.js';
import { IStatsOutlineQuery } from '../IStatsOutlineQuery.js';
import { IStatsQuery } from '../IStatsQuery.js';
import { ICaskQuery } from './ICaskQuery.js';

@injectable()
export class StatsCaskQuery implements IStatsQuery, ICaskQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Cask' = 'Cask';
  private readonly outlineQuery: IStatsOutlineQuery;
  private readonly itemQuery: IStatsItemQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;

  public constructor(
    @inject(Type.StatsOutlineMySQLQuery) outlineQuery: IStatsOutlineQuery,
    @inject(Type.StatsItemMySQLQuery) itemQuery: IStatsItemQuery,
    @inject(Type.LanguageCaskQuery) languageQuery: ILanguageQuery,
    @inject(Type.RegionCaskQuery) regionQuery: IRegionQuery
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

      throw new StatsError('StatsCaskQuery.findByStatsID()', err);
    }, StatsError, NoSuchElementError, DataSourceError);
  }
}
