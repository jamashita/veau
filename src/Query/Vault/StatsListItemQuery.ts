import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { inject, injectable } from 'inversify';

import { Type } from '../../Container/Types';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { Page } from '../../VO/Page/Page';
import { StatsListItemError } from '../../VO/StatsListItem/Error/StatsListItemError';
import { StatsListItemsError } from '../../VO/StatsListItem/Error/StatsListItemsError';
import { StatsListItem } from '../../VO/StatsListItem/StatsListItem';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import { StatsOutlinesError } from '../../VO/StatsOutline/Error/StatsOutlinesError';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { TermsError } from '../../VO/Term/Error/TermsError';
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
  private readonly statsOutlineQuery: IStatsOutlineQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly termQuery: ITermQuery;

  public constructor(
    @inject(Type.StatsOutlineAJAXQuery) statsOutlineQuery: IStatsOutlineQuery,
    @inject(Type.LocaleVaultQuery) localeQuery: ILocaleQuery,
    @inject(Type.TermCacheQuery) termQuery: ITermQuery
  ) {
    this.statsOutlineQuery = statsOutlineQuery;
    this.localeQuery = localeQuery;
    this.termQuery = termQuery;
  }

  public findByVeauAccountID(
    veauAccountID: VeauAccountID,
    page: Page
  ): Superposition<StatsListItems, StatsListItemsError | DataSourceError> {
    return this.statsOutlineQuery
      .findByVeauAccountID(veauAccountID, page)
      .map<StatsListItems, StatsOutlinesError | LocaleError | TermsError | StatsListItemError | DataSourceError>(
        (outlines: StatsOutlines) => {
          return this.localeQuery
            .all()
            .map<StatsListItems, LocaleError | TermsError | StatsListItemError | DataSourceError>(
              (locale: Locale) => {
                return this.termQuery
                  .all()
                  .map<StatsListItems, TermsError | StatsListItemError | DataSourceError>((terms: Terms) => {
                    const superpositions: Array<Superposition<StatsListItem, StatsListItemError>> = outlines.map<
                      Superposition<StatsListItem, StatsListItemError>
                    >((outline: StatsOutline) => {
                      return StatsListItem.ofOutline(outline, locale, terms);
                    });

                    return Superposition.all<StatsListItem, StatsListItemError>(superpositions).map<
                      StatsListItems,
                      StatsListItemError
                    >((items: Array<StatsListItem>) => {
                      return StatsListItems.ofArray(items);
                    });
                  }, StatsListItemError);
              },
              TermsError,
              StatsListItemError
            );
        },
        LocaleError,
        TermsError,
        StatsListItemError
      )
      .recover<StatsListItems, StatsListItemsError | DataSourceError>(
        (err: StatsOutlinesError | LocaleError | TermsError | StatsListItemError | DataSourceError) => {
          if (err instanceof DataSourceError) {
            throw err;
          }

          throw new StatsListItemsError('StatsListItemQuery.findByVeauAccountID()', err);
        },
        StatsListItemsError,
        DataSourceError
      );
  }
}
