import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { Page } from '../../VO/Page/Page';
import { StatsListItemError } from '../../VO/StatsListItem/Error/StatsListItemError';
import { StatsListItem } from '../../VO/StatsListItem/StatsListItem';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { TermError } from '../../VO/Term/Error/TermError';
import { Terms } from '../../VO/Term/Terms';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
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
    @inject(Type.StatsOutlineAJAXQuery) outlineQuery: IStatsOutlineQuery,
    @inject(Type.LocaleVaultQuery) localeQuery: ILocaleQuery,
    @inject(Type.TermCacheQuery) termQuery: ITermQuery
  ) {
    this.outlineQuery = outlineQuery;
    this.localeQuery = localeQuery;
    this.termQuery = termQuery;
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsListItems, StatsListItemError | DataSourceError> {
    return this.outlineQuery.findByVeauAccountID(veauAccountID, page).map<StatsListItems, StatsOutlineError | LocaleError | TermError | StatsListItemError | DataSourceError>((outlines: StatsOutlines) => {
      return this.localeQuery.all().map<StatsListItems, LocaleError | TermError | StatsListItemError | DataSourceError>((locale: Locale) => {
        return this.termQuery.all().map<StatsListItems, TermError | StatsListItemError | DataSourceError>((terms: Terms) => {
          const items: Array<StatsListItem> = outlines.map<StatsListItem>((outline: StatsOutline) => {
            return StatsListItem.ofOutline(outline, locale, terms);
          });

          return StatsListItems.ofArray(items);
        }, StatsListItemError);
      }, TermError);
    }, LocaleError).recover<StatsListItems, StatsListItemError | DataSourceError>((err: StatsOutlineError | LocaleError | TermError | StatsListItemError | DataSourceError) => {
      if (err instanceof DataSourceError) {
        throw err;
      }

      throw new StatsListItemError('StatsListItemQuery.findByVeauAccountID()', err);
    }, StatsListItemError, DataSourceError);
  }
}
