import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError.js';
import { Locale } from '../../../domain/vo/Locale/Locale.js';
import { Page } from '../../../domain/vo/Page/Page.js';
import { StatsListItemError } from '../../../domain/vo/StatsListItem/error/StatsListItemError.js';
import { StatsListItem } from '../../../domain/vo/StatsListItem/StatsListItem.js';
import { StatsListItems } from '../../../domain/vo/StatsListItem/StatsListItems.js';
import { StatsOutlineError } from '../../../domain/vo/StatsOutline/error/StatsOutlineError.js';
import { StatsOutline } from '../../../domain/vo/StatsOutline/StatsOutline.js';
import { StatsOutlines } from '../../../domain/vo/StatsOutline/StatsOutlines.js';
import { TermError } from '../../../domain/vo/Term/error/TermError.js';
import { Terms } from '../../../domain/vo/Term/Terms.js';
import { VeauAccountID } from '../../../domain/vo/VeauAccount/VeauAccountID.js';
import { ILocaleQuery } from '../ILocaleQuery.js';
import { IStatsListItemQuery } from '../IStatsListItemQuery.js';
import { IStatsOutlineQuery } from '../IStatsOutlineQuery.js';
import { ITermQuery } from '../ITermQuery.js';
import { IBinQuery } from './IBinQuery.js';

@injectable()
export class StatsListItemBinQuery implements IStatsListItemQuery, IBinQuery {
  public readonly noun: 'StatsListItemQuery' = 'StatsListItemQuery';
  public readonly source: 'Bin' = 'Bin';
  private readonly outlineQuery: IStatsOutlineQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly termQuery: ITermQuery;

  public constructor(
    @inject(Type.StatsOutlineFetchQuery) outlineQuery: IStatsOutlineQuery,
    @inject(Type.LocaleBinQuery) localeQuery: ILocaleQuery,
    @inject(Type.TermHeapQuery) termQuery: ITermQuery
  ) {
    this.outlineQuery = outlineQuery;
    this.localeQuery = localeQuery;
    this.termQuery = termQuery;
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsListItems, DataSourceError | StatsListItemError> {
    return this.outlineQuery.findByVeauAccountID(veauAccountID, page).map<StatsListItems, DataSourceError | LocaleError | StatsListItemError | StatsOutlineError | TermError>((outlines: StatsOutlines) => {
      return this.localeQuery.all().map<StatsListItems, DataSourceError | LocaleError | StatsListItemError | TermError>((locale: Locale) => {
        return this.termQuery.all().map<StatsListItems, DataSourceError | StatsListItemError | TermError>((terms: Terms) => {
          const items: Array<StatsListItem> = outlines.toArray().map<StatsListItem>((outline: StatsOutline) => {
            return StatsListItem.ofOutline(outline, locale, terms);
          });

          return StatsListItems.ofArray(items);
        }, StatsListItemError);
      }, TermError);
    }, LocaleError).recover<StatsListItems, DataSourceError | StatsListItemError>((err: DataSourceError | LocaleError | StatsListItemError | StatsOutlineError | TermError) => {
      if (err instanceof DataSourceError) {
        throw err;
      }

      throw new StatsListItemError('StatsListItemBinQuery.findByVeauAccountID()', err);
    }, StatsListItemError, DataSourceError);
  }
}
