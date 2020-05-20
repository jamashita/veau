import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, Schrodinger, Superposition } from 'publikum';

import { Type } from '../../Container/Types';
import { Language } from '../../VO/Language/Language';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { Page } from '../../VO/Page/Page';
import { Region } from '../../VO/Region/Region';
import { StatsListItemsError } from '../../VO/StatsListItem/Error/StatsListItemsError';
import { StatsListItem } from '../../VO/StatsListItem/StatsListItem';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import { StatsOutlinesError } from '../../VO/StatsOutline/Error/StatsOutlinesError';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { TermsError } from '../../VO/Term/Error/TermsError';
import { Term } from '../../VO/Term/Term';
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

  public async findByVeauAccountID(
    veauAccountID: VeauAccountID,
    page: Page
  ): Promise<Superposition<StatsListItems, StatsListItemsError | DataSourceError>> {
    const [superposition1, superposition2, superposition3]: [
      Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>,
      Superposition<Locale, LocaleError | DataSourceError>,
      Superposition<Terms, TermsError | DataSourceError>
    ] = await Promise.all([
      this.statsOutlineQuery.findByVeauAccountID(veauAccountID, page),
      this.localeQuery.all(),
      this.termQuery.all()
    ]);

    return superposition1.match<StatsListItems, StatsListItemsError | DataSourceError>(
      (outlines: StatsOutlines) => {
        return superposition2.match<StatsListItems, StatsListItemsError | DataSourceError>(
          (locale: Locale) => {
            return superposition3.match<StatsListItems, StatsListItemsError | DataSourceError>(
              (terms: Terms) => {
                const superpositions: Array<Superposition<StatsListItem, StatsListItemsError>> = outlines.map<
                  Superposition<StatsListItem, StatsListItemsError>
                >((outline: StatsOutline) => {
                  return this.extract(outline, locale, terms);
                });

                return Schrodinger.all<StatsListItem, StatsListItemsError>(superpositions).match<
                  StatsListItems,
                  StatsListItemsError
                >(
                  (items: Array<StatsListItem>) => {
                    return Alive.of<StatsListItems, StatsListItemsError>(StatsListItems.ofArray(items));
                  },
                  (err: StatsListItemsError, self: Dead<Array<StatsListItem>, StatsListItemsError>) => {
                    return self.transpose<StatsListItems>();
                  }
                );
              },
              (err: TermsError | DataSourceError) => {
                if (err instanceof DataSourceError) {
                  return Dead.of<StatsListItems, DataSourceError>(err);
                }

                return Dead.of<StatsListItems, StatsListItemsError>(
                  new StatsListItemsError('StatsListItemQuery.findByVeauAccountID()', err)
                );
              }
            );
          },
          (err: LocaleError | DataSourceError) => {
            if (err instanceof DataSourceError) {
              return Dead.of<StatsListItems, DataSourceError>(err);
            }

            return Dead.of<StatsListItems, StatsListItemsError>(
              new StatsListItemsError('StatsListItemQuery.findByVeauAccountID()', err)
            );
          }
        );
      },
      (err: StatsOutlinesError | DataSourceError) => {
        if (err instanceof DataSourceError) {
          return Dead.of<StatsListItems, DataSourceError>(err);
        }

        return Dead.of<StatsListItems, StatsListItemsError>(
          new StatsListItemsError('StatsListItemQuery.findByVeauAccountID()', err)
        );
      }
    );
  }

  private extract(
    outline: StatsOutline,
    locale: Locale,
    terms: Terms
  ): Superposition<StatsListItem, StatsListItemsError> {
    return locale
      .getLanguages()
      .get(outline.getLanguageID())
      .toSuperposition()
      .match<StatsListItem, StatsListItemsError>(
        (language: Language) => {
          return locale
            .getRegions()
            .get(outline.getRegionID())
            .toSuperposition()
            .match<StatsListItem, StatsListItemsError>(
              (region: Region) => {
                return terms
                  .get(outline.getTermID())
                  .toSuperposition()
                  .match<StatsListItem, StatsListItemsError>(
                    (term: Term) => {
                      return Alive.of<StatsListItem, StatsListItemsError>(
                        StatsListItem.of(outline, language, region, term)
                      );
                    },
                    () => {
                      return Dead.of<StatsListItem, StatsListItemsError>(
                        new StatsListItemsError(`NO SUCH REGION: ${outline.getTermID().toString()}`)
                      );
                    }
                  );
              },
              () => {
                return Dead.of<StatsListItem, StatsListItemsError>(
                  new StatsListItemsError(`NO SUCH REGION: ${outline.getRegionID().toString()}`)
                );
              }
            );
        },
        () => {
          return Dead.of<StatsListItem, StatsListItemsError>(
            new StatsListItemsError(`NO SUCH LANGUAGE: ${outline.getLanguageID().toString()}`)
          );
        }
      );
  }
}
