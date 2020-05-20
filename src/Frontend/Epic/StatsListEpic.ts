import { inject, injectable } from 'inversify';
import { DataSourceError, Superposition } from 'publikum';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { EMPTY, from, merge, Observable, of } from 'rxjs';
import { filter, map, mapTo, mergeMap } from 'rxjs/operators';

import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { NoSuchElementError } from '../../Query/Error/NoSuchElementError';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { IRegionQuery } from '../../Query/Interface/IRegionQuery';
import { IStatsListItemQuery } from '../../Query/Interface/IStatsListItemQuery';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { Language } from '../../VO/Language/Language';
import { Page } from '../../VO/Page/Page';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { Region } from '../../VO/Region/Region';
import { StatsListItemsError } from '../../VO/StatsListItem/Error/StatsListItemsError';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
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
  private readonly statsListItemQuery: IStatsListItemQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
    @inject(Type.StatsListItemVaultQuery) statsListItemQuery: IStatsListItemQuery,
    @inject(Type.LanguageVaultQuery) languageQuery: ILanguageQuery,
    @inject(Type.RegionVaultQuery) regionQuery: IRegionQuery,
    @inject(Type.StatsAJAXCommand) statsCommand: IStatsCommand
  ) {
    this.statsListItemQuery = statsListItemQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.statsCommand = statsCommand;
  }

  public init(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge(
      this.findStatsList(action$, state$),
      this.nameTyped(action$, state$),
      this.unitTyped(action$, state$),
      this.iso639Selected(action$, state$),
      this.iso3166Selected(action$, state$),
      this.termSelected(action$, state$),
      this.save(action$, state$)
    );
  }

  public findStatsList(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe<Action, Action>(
      ofType<Action, Action>(STATS_LIST_INITIALIZE),
      mergeMap<Action, Observable<Action>>(() => {
        // prettier-ignore
        const {
          value: {
            identity
          }
        } = state$;

        return from<Promise<Superposition<StatsListItems, StatsListItemsError | DataSourceError>>>(
          this.statsListItemQuery.findByVeauAccountID(identity.getVeauAccountID(), Page.of(1).get())
        ).pipe<Action>(
          mergeMap<Superposition<StatsListItems, StatsListItemsError | DataSourceError>, Observable<Action>>(
            (superposition: Superposition<StatsListItems, StatsListItemsError | DataSourceError>) => {
              return superposition.match<Observable<Action>>(
                (listItems: StatsListItems) => {
                  return of<Action>(updateStatsListItems(listItems));
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
    return action$.pipe<StatsListNameTypedAction, Action>(
      ofType<Action, StatsListNameTypedAction>(STATS_LIST_NAME_TYPED),
      map<StatsListNameTypedAction, Action>((action: StatsListNameTypedAction) => {
        // prettier-ignore
        const {
          value: {
            statsList: {
              stats
            }
          }
        } = state$;

        const newStats: Stats = Stats.of(
          StatsOutline.of(
            stats.getStatsID(),
            stats.getLanguage().getLanguageID(),
            stats.getRegion().getRegionID(),
            stats.getTerm().getTermID(),
            action.name,
            stats.getUnit(),
            stats.getUpdatedAt()
          ),
          stats.getLanguage(),
          stats.getRegion(),
          stats.getTerm(),
          stats.getItems()
        );

        return updateNewStats(newStats);
      })
    );
  }

  public unitTyped(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe<StatsListUnitTypedAction, Action>(
      ofType<Action, StatsListUnitTypedAction>(STATS_LIST_UNIT_TYPED),
      map<StatsListUnitTypedAction, Action>((action: StatsListUnitTypedAction) => {
        // prettier-ignore
        const {
          value: {
            statsList: {
              stats
            }
          }
        } = state$;

        const newStats: Stats = Stats.of(
          StatsOutline.of(
            stats.getStatsID(),
            stats.getLanguage().getLanguageID(),
            stats.getRegion().getRegionID(),
            stats.getTerm().getTermID(),
            stats.getName(),
            action.unit,
            stats.getUpdatedAt()
          ),
          stats.getLanguage(),
          stats.getRegion(),
          stats.getTerm(),
          stats.getItems()
        );

        return updateNewStats(newStats);
      })
    );
  }

  public iso639Selected(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe<StatsListISO639SelectedAction, Action>(
      ofType<Action, StatsListISO639SelectedAction>(STATS_LIST_ISO639_SELECTED),
      mergeMap<StatsListISO639SelectedAction, Observable<Action>>((action: StatsListISO639SelectedAction) => {
        return from<Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>>(
          this.languageQuery.findByISO639(action.iso639)
        ).pipe<Action>(
          mergeMap<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>, Observable<Action>>(
            (superposition: Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>) => {
              // prettier-ignore
              const {
                value: {
                  statsList: {
                    stats
                  }
                }
              } = state$;

              return EMPTY.pipe<never, Action>(
                filter<never>(() => {
                  return superposition.isAlive();
                }),
                map<never, Action>(() => {
                  const newStats: Stats = Stats.of(
                    stats.getOutline(),
                    superposition.get(),
                    stats.getRegion(),
                    stats.getTerm(),
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
    return action$.pipe<StatsListISO3166SelectedAction, Action>(
      ofType<Action, StatsListISO3166SelectedAction>(STATS_LIST_ISO3166_SELECTED),
      mergeMap<StatsListISO3166SelectedAction, Observable<Action>>((action: StatsListISO3166SelectedAction) => {
        return from<Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>>(
          this.regionQuery.findByISO3166(action.iso3166)
        ).pipe<Action>(
          mergeMap<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>, Observable<Action>>(
            (superposition: Superposition<Region, RegionError | NoSuchElementError | DataSourceError>) => {
              // prettier-ignore
              const {
                value: {
                  statsList: {
                    stats
                  }
                }
              } = state$;

              return EMPTY.pipe<never, Action>(
                filter<never>(() => {
                  return superposition.isAlive();
                }),
                map<never, Action>(() => {
                  const newStats: Stats = Stats.of(
                    stats.getOutline(),
                    stats.getLanguage(),
                    superposition.get(),
                    stats.getTerm(),
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
    return action$.pipe<StatsListTermSelectedAction, Action>(
      ofType<Action, StatsListTermSelectedAction>(STATS_LIST_TERM_SELECTED),
      map<StatsListTermSelectedAction, Action>((action: StatsListTermSelectedAction) => {
        // prettier-ignore
        const {
          value: {
            statsList: {
              stats
            }
          }
        } = state$;

        const newStats: Stats = Stats.of(
          stats.getOutline(),
          stats.getLanguage(),
          stats.getRegion(),
          action.term,
          stats.getItems()
        );

        return updateNewStats(newStats);
      })
    );
  }

  public save(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe<Action, Action, Action, Action, Action>(
      ofType<Action, Action>(STATS_LIST_SAVE_NEW_STATS),
      filter<Action>(() => {
        // prettier-ignore
        const {
          value: {
            statsList: {
              stats
            }
          }
        } = state$;

        return !stats.isFilled();
      }),
      mapTo<Action, Action>(closeNewStatsModal()),
      mapTo<Action, Action>(loading()),
      mergeMap(() => {
        // prettier-ignore
        const {
          value: {
            identity,
            statsList: {
              stats
            }
          }
        } = state$;

        return from<Promise<Superposition<unknown, DataSourceError>>>(
          this.statsCommand.create(stats, identity.getVeauAccountID())
        ).pipe<Action>(
          mergeMap<Superposition<unknown, DataSourceError>, Observable<Action>>(
            (superposition: Superposition<unknown, DataSourceError>) => {
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
