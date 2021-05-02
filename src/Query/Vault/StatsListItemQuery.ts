import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { LocaleError } from '../../domain/VO/Locale/Error/LocaleError';
import { Locale } from '../../domain/VO/Locale/Locale';
import { Page } from '../../domain/VO/Page/Page';
import { StatsListItemError } from '../../domain/VO/StatsListItem/Error/StatsListItemError';
import { StatsListItem } from '../../domain/VO/StatsListItem/StatsListItem';
import { StatsListItems } from '../../domain/VO/StatsListItem/StatsListItems';
import { StatsOutlineError } from '../../domain/VO/StatsOutline/Error/StatsOutlineError';
import { StatsOutline } from '../../domain/VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../domain/VO/StatsOutline/StatsOutlines';
import { TermError } from '../../domain/VO/Term/Error/TermError';
import { Terms } from '../../domain/VO/Term/Terms';
import { VeauAccountID } from '../../domain/VO/VeauAccount/VeauAccountID';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IStatsListItemQuery } from '../Interface/IStatsListItemQuery';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';
import { ITermQuery } from '../Interface/ITermQuery';
import { IVaultQuery } from './Interface/IVaultQuery';

@injectable()
export class StatsListItemQuery implements IStatsListItemQuery, IVaultQuery {
  public readonly noun: 'StatsListItemQuery' = 'StatsListItemQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly outlineQuery: IStatsOutlineQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly termQuery: ITermQuery;

  public constructor(
    @inject(Type.StatsOutlineFetchQuery) outlineQuery: IStatsOutlineQuery,
    @inject(Type.LocaleVaultQuery) localeQuery: ILocaleQuery,
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

      throw new StatsListItemError('StatsListItemQuery.findByVeauAccountID()', err);
    }, StatsListItemError, DataSourceError);
  }
}
