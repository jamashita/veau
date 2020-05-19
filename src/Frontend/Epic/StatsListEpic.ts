import { inject, injectable } from 'inversify';
import { DataSourceError, Superposition } from 'publikum';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { EMPTY, from, merge, Observable, of } from 'rxjs';
import { filter, map, mapTo, mergeMap } from 'rxjs/operators';

import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { TYPE } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { NoSuchElementError } from '../../Query/Error/NoSuchElementError';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { IRegionQuery } from '../../Query/Interface/IRegionQuery';
import { IStatsOutlineQuery } from '../../Query/Interface/IStatsOutlineQuery';
import { Language } from '../../VO/Language/Language';
import { Page } from '../../VO/Page/Page';
import { Region } from '../../VO/Region/Region';
import { StatsOutlinesError } from '../../VO/StatsOutline/Error/StatsOutlinesError';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import {
  Action,
  STATS_LIST_INITIALIZE,
  STATS_LIST_ISO3166_SELECTED,
  STATS_LIST_ISO639_SELECTED,
  STATS_LIST_NAME_TYPED,
  STATS_LIST_SAVE_NEW_STATS,
  STATS_LIST_TERM_SELECTED,
  STATS_LIST_UNIT_TYPED,
  StatsListISO3166SelectedAction,
  StatsListISO639SelectedAction,
  StatsListNameTypedAction,
  StatsListTermSelectedAction,
  StatsListUnitTypedAction
} from '../Action/Action';
import { loaded, loading } from '../Action/LoadingAction';
import { raiseModal } from '../Action/ModalAction';
import { appearNotification } from '../Action/NotificationAction';
import { pushToStatsEdit } from '../Action/RedirectAction';
import { resetStatsListItems, updateStatsListItems } from '../Action/StatsAction';
import { closeNewStatsModal, resetNewStats, updateNewStats } from '../Action/StatsListAction';
import { State } from '../State';

@injectable()
export class StatsListEpic {
  private readonly statsOutlineQuery: IStatsOutlineQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
    @inject(TYPE.StatsOutlineAJAXQuery) statsOutlineQuery: IStatsOutlineQuery,
    @inject(TYPE.LanguageVaultQuery) languageQuery: ILanguageQuery,
    @inject(TYPE.RegionVaultQuery) regionQuery: IRegionQuery,
    @inject(TYPE.StatsAJAXCommand) statsCommand: IStatsCommand
  ) {
    this.statsOutlineQuery = statsOutlineQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.statsCommand = statsCommand;
  }

  public init(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge(
      this.findStatsList(action$),
      this.nameTyped(action$, state$),
      this.unitTyped(action$, state$),
      this.iso639Selected(action$, state$),
      this.iso3166Selected(action$, state$),
      this.termSelected(action$, state$),
      this.save(action$, state$)
    );
  }

  public findStatsList(action$: ActionsObservable<Action>): Observable<Action> {
    return action$.pipe<Action, Action>(
      ofType<Action, Action>(STATS_LIST_INITIALIZE),
      mergeMap<Action, Observable<Action>>(() => {
        return from<Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>>>(
          this.statsOutlineQuery.findByVeauAccountID(VeauAccountID.generate(), Page.of(1).get())
        ).pipe<Action>(
          mergeMap<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>, Observable<Action>>(
            (superposition: Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>) => {
              return superposition.match<Observable<Action>>(
                (statsOutlines: StatsOutlines) => {
                  return of<Action>(updateStatsListItems(statsOutlines));
                },
                () => {
                  return of<Action>(
                    resetStatsListItems(),
                    appearNotification('error', 'center', 'top', 'STATS_OVERVIEW_NOT_FOUND')
                  );
                }
              );
            }
          )
        );
      })
    );
  }

  public nameTyped(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        statsList: {
          stats
        }
      }
    } = state$;

    return action$.pipe<StatsListNameTypedAction, Action>(
      ofType<Action, StatsListNameTypedAction>(STATS_LIST_NAME_TYPED),
      map<StatsListNameTypedAction, Action>((action: StatsListNameTypedAction) => {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          stats.getLanguage(),
          stats.getRegion(),
          stats.getTerm(),
          action.name,
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems()
        );

        return updateNewStats(newStats);
      })
    );
  }

  public unitTyped(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        statsList: {
          stats
        }
      }
    } = state$;

    return action$.pipe<StatsListUnitTypedAction, Action>(
      ofType<Action, StatsListUnitTypedAction>(STATS_LIST_UNIT_TYPED),
      map<StatsListUnitTypedAction, Action>((action: StatsListUnitTypedAction) => {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          stats.getLanguage(),
          stats.getRegion(),
          stats.getTerm(),
          stats.getName(),
          action.unit,
          stats.getUpdatedAt(),
          stats.getItems()
        );

        return updateNewStats(newStats);
      })
    );
  }

  public iso639Selected(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        statsList: {
          stats
        }
      }
    } = state$;

    return action$.pipe<StatsListISO639SelectedAction, Action>(
      ofType<Action, StatsListISO639SelectedAction>(STATS_LIST_ISO639_SELECTED),
      mergeMap<StatsListISO639SelectedAction, Observable<Action>>((action: StatsListISO639SelectedAction) => {
        return from<Promise<Superposition<Language, NoSuchElementError | DataSourceError>>>(
          this.languageQuery.findByISO639(action.iso639)
        ).pipe<Action>(
          mergeMap<Superposition<Language, NoSuchElementError | DataSourceError>, Observable<Action>>(
            (superposition: Superposition<Language, NoSuchElementError | DataSourceError>) => {
              return EMPTY.pipe<never, Action>(
                filter<never>(() => {
                  return superposition.isAlive();
                }),
                map<never, Action>(() => {
                  const newStats: Stats = Stats.of(
                    stats.getStatsID(),
                    superposition.get(),
                    stats.getRegion(),
                    stats.getTerm(),
                    stats.getName(),
                    stats.getUnit(),
                    stats.getUpdatedAt(),
                    stats.getItems()
                  );

                  return updateNewStats(newStats);
                })
              );
            }
          )
        );
      })
    );
  }

  public iso3166Selected(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        statsList: {
          stats
        }
      }
    } = state$;

    return action$.pipe<StatsListISO3166SelectedAction, Action>(
      ofType<Action, StatsListISO3166SelectedAction>(STATS_LIST_ISO3166_SELECTED),
      mergeMap<StatsListISO3166SelectedAction, Observable<Action>>((action: StatsListISO3166SelectedAction) => {
        return from<Promise<Superposition<Region, NoSuchElementError | DataSourceError>>>(
          this.regionQuery.findByISO3166(action.iso3166)
        ).pipe<Action>(
          mergeMap<Superposition<Region, NoSuchElementError | DataSourceError>, Observable<Action>>(
            (superposition: Superposition<Region, NoSuchElementError | DataSourceError>) => {
              return EMPTY.pipe<never, Action>(
                filter<never>(() => {
                  return superposition.isAlive();
                }),
                map<never, Action>(() => {
                  const newStats: Stats = Stats.of(
                    stats.getStatsID(),
                    stats.getLanguage(),
                    superposition.get(),
                    stats.getTerm(),
                    stats.getName(),
                    stats.getUnit(),
                    stats.getUpdatedAt(),
                    stats.getItems()
                  );

                  return updateNewStats(newStats);
                })
              );
            }
          )
        );
      })
    );
  }

  public termSelected(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        statsList: {
          stats
        }
      }
    } = state$;

    return action$.pipe<StatsListTermSelectedAction, Action>(
      ofType<Action, StatsListTermSelectedAction>(STATS_LIST_TERM_SELECTED),
      map<StatsListTermSelectedAction, Action>((action: StatsListTermSelectedAction) => {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          stats.getLanguage(),
          stats.getRegion(),
          action.term,
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems()
        );

        return updateNewStats(newStats);
      })
    );
  }

  public save(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        statsList: {
          stats
        }
      }
    } = state$;

    return action$.pipe<Action, Action, Action, Action, Action>(
      ofType<Action, Action>(STATS_LIST_SAVE_NEW_STATS),
      filter<Action>(() => {
        return !stats.isFilled();
      }),
      mapTo<Action, Action>(closeNewStatsModal()),
      mapTo<Action, Action>(loading()),
      mergeMap(() => {
        return from<Promise<Superposition<void, DataSourceError>>>(
          this.statsCommand.create(stats, VeauAccountID.generate())
        ).pipe<Action>(
          mergeMap<Superposition<void, DataSourceError>, Observable<Action>>(
            (superposition: Superposition<void, DataSourceError>) => {
              return EMPTY.pipe<Action, Action>(
                mapTo<never, Action>(loaded()),
                mergeMap<Action, Observable<Action>>(() => {
                  return superposition.match<Observable<Action>>(
                    () => {
                      return of<Action>(pushToStatsEdit(stats.getStatsID()), resetNewStats());
                    },
                    () => {
                      return of<Action>(
                        loaded(),
                        raiseModal('FAILED_TO_SAVE_NEW_STATS', 'FAILED_TO_SAVE_NEW_STATS_DESCRIPTION')
                      );
                    }
                  );
                })
              );
            }
          )
        );
      })
    );
  }
}
