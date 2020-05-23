import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, Superposition } from 'publikum';

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

  public async findByStatsID(
    statsID: StatsID
  ): Promise<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>> {
    const superposition1: Superposition<
      StatsOutline,
      StatsOutlineError | NoSuchElementError | DataSourceError
    > = await this.statsOutlineQuery.find(statsID);

    return superposition1.match<Stats, StatsError | NoSuchElementError | DataSourceError>(
      async (outline: StatsOutline) => {
        const superposition2: Superposition<
          StatsItems,
          StatsItemsError | DataSourceError
        > = await this.statsItemQuery.findByStatsID(statsID);

        return superposition2.match<Stats, StatsError | NoSuchElementError | DataSourceError>(
          async (items: StatsItems) => {
            const superposition3: Superposition<
              Language,
              LanguageError | NoSuchElementError | DataSourceError
            > = await this.languageQuery.find(outline.getLanguageID());

            return superposition3.match<Stats, StatsError | NoSuchElementError | DataSourceError>(
              async (language: Language) => {
                const superposition4: Superposition<
                  Region,
                  RegionError | NoSuchElementError | DataSourceError
                > = await this.regionQuery.find(outline.getRegionID());

                return superposition4.match<Stats, StatsError | NoSuchElementError | DataSourceError>(
                  (region: Region) => {
                    const superposition5: Superposition<Term, TermError> = Term.ofTermID(outline.getTermID());

                    return superposition5.match<Stats, StatsError | NoSuchElementError | DataSourceError>(
                      (term: Term) => {
                        return Alive.of<Stats, StatsError | NoSuchElementError | DataSourceError>(
                          Stats.of(outline, language, region, term, items)
                        );
                      },
                      (err: TermError) => {
                        return Dead.of<Stats, StatsError | NoSuchElementError | DataSourceError>(
                          new StatsError('StatsQuery.findByStatsID()', err)
                        );
                      }
                    );
                  },
                  (err: RegionError | NoSuchElementError | DataSourceError) => {
                    if (err instanceof RegionError) {
                      return Dead.of<Stats, StatsError>(new StatsError('StatsQuery.findByStatsID()', err));
                    }

                    return Dead.of<Stats, NoSuchElementError | DataSourceError>(err);
                  }
                );
              },
              (err: LanguageError | NoSuchElementError | DataSourceError) => {
                if (err instanceof LanguageError) {
                  return Promise.resolve<Superposition<Stats, StatsError>>(
                    Dead.of<Stats, StatsError>(new StatsError('StatsQuery.findByStatsID()', err))
                  );
                }

                return Promise.resolve<Superposition<Stats, NoSuchElementError | DataSourceError>>(
                  Dead.of<Stats, NoSuchElementError | DataSourceError>(err)
                );
              }
            );
          },
          (err: StatsItemsError | DataSourceError) => {
            if (err instanceof StatsItemsError) {
              return Promise.resolve<Superposition<Stats, StatsError>>(
                Dead.of<Stats, StatsError>(new StatsError('StatsQuery.findByStatsID()', err))
              );
            }

            return Promise.resolve<Superposition<Stats, NoSuchElementError | DataSourceError>>(
              Dead.of<Stats, NoSuchElementError | DataSourceError>(err)
            );
          }
        );
      },
      (err: StatsOutlineError | NoSuchElementError | DataSourceError) => {
        if (err instanceof StatsOutlineError) {
          return Promise.resolve<Superposition<Stats, StatsError>>(
            Dead.of<Stats, StatsError>(new StatsError('StatsQuery.findByStatsID()', err))
          );
        }

        return Promise.resolve<Superposition<Stats, NoSuchElementError | DataSourceError>>(
          Dead.of<Stats, NoSuchElementError | DataSourceError>(err)
        );
      }
    );
  }
}
