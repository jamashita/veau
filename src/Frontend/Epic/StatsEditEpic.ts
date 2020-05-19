import { inject, injectable } from 'inversify';
import { DataSourceError, Present, Quantum, Superposition } from 'publikum';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { EMPTY, from, merge, Observable, of } from 'rxjs';
import { filter, map, mapTo, mergeMap } from 'rxjs/operators';

import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { TYPE } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { NoSuchElementError } from '../../Query/Error/NoSuchElementError';
import { StatsError } from '../../Entity/Stats/Error/StatsError';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { ILocaleQuery } from '../../Query/Interface/ILocaleQuery';
import { IRegionQuery } from '../../Query/Interface/IRegionQuery';
import { IStatsQuery } from '../../Query/Interface/IStatsQuery';
import { AsOf } from '../../VO/AsOf/AsOf';
import { Language } from '../../VO/Language/Language';
import { Region } from '../../VO/Region/Region';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import {
  Action,
  STATS_EDIT_DATA_DELETED,
  STATS_EDIT_DATA_FILLED,
  STATS_EDIT_INITIALIZATION_FAILURE,
  STATS_EDIT_INITIALIZE,
  STATS_EDIT_INVALID_DATE_INPUT,
  STATS_EDIT_INVALID_VALUE_INPUT,
  STATS_EDIT_ISO3166_SELECTED,
  STATS_EDIT_ISO639_SELECTED,
  STATS_EDIT_ITEM_NAME_TYPED,
  STATS_EDIT_ITEM_SAVE,
  STATS_EDIT_NAME_TYPED,
  STATS_EDIT_REMOVE_SELECTING_ITEM,
  STATS_EDIT_ROW_MOVED,
  STATS_EDIT_ROW_SELECTED,
  STATS_EDIT_SAVE_STATS,
  STATS_EDIT_SELECTING_ITEM_NAME_TYPED,
  STATS_EDIT_START_DATE_DETERMINED,
  STATS_EDIT_UNIT_TYPED,
  StatsEditDataDeletedAction,
  StatsEditDataFilledAction,
  StatsEditInitializeAction,
  StatsEditISO3166SelectedAction,
  StatsEditISO639SelectedAction,
  StatsEditItemNameTypedAction,
  StatsEditNameTypedAction,
  StatsEditRemoveSelectingItemAction,
  StatsEditRowMovedAction,
  StatsEditRowSelectedAction,
  StatsEditSelectingItemNameTypedAction,
  StatsEditStartDateDeterminedAction,
  StatsEditUnitTypedAction
} from '../Action/Action';
import { loaded, loading } from '../Action/LoadingAction';
import { raiseModal } from '../Action/ModalAction';
import { appearNotification } from '../Action/NotificationAction';
import { pushToStatsList } from '../Action/RedirectAction';
import { resetStatsItem, updateStats, updateStatsItem } from '../Action/StatsAction';
import { clearSelectingItem, selectItem, updateSelectingItem } from '../Action/StatsEditAction';
import { State } from '../State';

@injectable()
export class StatsEditEpic {
  private readonly statsQuery: IStatsQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
    @inject(TYPE.StatsAJAXQuery) statsQuery: IStatsQuery,
    @inject(TYPE.LocaleVaultQuery) localeQuery: ILocaleQuery,
    @inject(TYPE.LanguageVaultQuery) languageQuery: ILanguageQuery,
    @inject(TYPE.RegionVaultQuery) regionQuery: IRegionQuery,
    @inject(TYPE.StatsAJAXCommand) statsCommand: IStatsCommand
  ) {
    this.statsQuery = statsQuery;
    this.localeQuery = localeQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.statsCommand = statsCommand;
  }

  public init(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge<Action>(
      this.findStats(action$),
      this.initializationFailed(action$),
      this.nameTyped(action$, state$),
      this.unitTyped(action$, state$),
      this.iso639Selected(action$, state$),
      this.iso3166Selected(action$, state$),
      this.dataFilled(action$, state$),
      this.dataDeleted(action$, state$),
      this.itemNameTyped(action$, state$),
      this.saveItem(action$, state$),
      this.rowSelected(action$, state$),
      this.selectingItemNameTyped(action$, state$),
      this.startDateDetermined(action$, state$),
      this.invalidDateInput(action$),
      this.rowMoved(action$, state$),
      this.invalidValueInput(action$),
      this.removeItem(action$, state$),
      this.save(action$, state$)
    );
  }

  public findStats(action$: ActionsObservable<Action>): Observable<Action> {
    return action$.pipe<StatsEditInitializeAction, Action>(
      ofType<Action, StatsEditInitializeAction>(STATS_EDIT_INITIALIZE),
      mergeMap<StatsEditInitializeAction, Observable<Action>>((action: StatsEditInitializeAction) => {
        return from<Promise<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>>>(
          this.statsQuery.findByStatsID(action.statsID)
        ).pipe<Action>(
          mergeMap<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>, Observable<Action>>(
            (superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>) => {
              return superposition.match<Observable<Action>>(
                (stats: Stats) => {
                  return of<Action>(updateStats(stats), clearSelectingItem());
                },
                (err: StatsError | NoSuchElementError | DataSourceError) => {
                  if (err instanceof NoSuchElementError) {
                    return of<Action>(
                      pushToStatsList(),
                      appearNotification('error', 'center', 'top', 'STATS_NOT_FOUND')
                    );
                  }

                  return of<Action>(pushToStatsList());
                }
              );
            }
          )
        );
      })
    );
  }

  public initializationFailed(action$: ActionsObservable<Action>): Observable<Action> {
    return action$.pipe<Action, Action, Action>(
      ofType<Action, Action>(STATS_EDIT_INITIALIZATION_FAILURE),
      mapTo<Action, Action>(pushToStatsList()),
      mapTo<Action, Action>(appearNotification('error', 'center', 'top', 'MALFORMAT_STATS_ID'))
    );
  }

  public nameTyped(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats
      }
    } = state$;

    return action$.pipe<StatsEditNameTypedAction, Action>(
      ofType<Action, StatsEditNameTypedAction>(STATS_EDIT_NAME_TYPED),
      map<StatsEditNameTypedAction, Action>((action: StatsEditNameTypedAction) => {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          stats.getLanguageID(),
          stats.getRegionID(),
          stats.getTerm(),
          action.name,
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems()
        );

        return updateStats(newStats);
      })
    );
  }

  public unitTyped(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats
      }
    } = state$;

    return action$.pipe<StatsEditUnitTypedAction, Action>(
      ofType<Action, StatsEditUnitTypedAction>(STATS_EDIT_UNIT_TYPED),
      map<StatsEditUnitTypedAction, Action>((action: StatsEditUnitTypedAction) => {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          stats.getLanguageID(),
          stats.getRegionID(),
          stats.getTerm(),
          stats.getName(),
          action.unit,
          stats.getUpdatedAt(),
          stats.getItems()
        );

        return updateStats(newStats);
      })
    );
  }

  public iso639Selected(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats
      }
    } = state$;

    return action$.pipe<StatsEditISO639SelectedAction, Action>(
      ofType<Action, StatsEditISO639SelectedAction>(STATS_EDIT_ISO639_SELECTED),
      mergeMap<StatsEditISO639SelectedAction, Observable<Action>>((action: StatsEditISO639SelectedAction) => {
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
                    stats.getRegionID(),
                    stats.getTerm(),
                    stats.getName(),
                    stats.getUnit(),
                    stats.getUpdatedAt(),
                    stats.getItems()
                  );

                  return updateStats(newStats);
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
        stats
      }
    } = state$;

    return action$.pipe<StatsEditISO3166SelectedAction, Action>(
      ofType<Action, StatsEditISO3166SelectedAction>(STATS_EDIT_ISO3166_SELECTED),
      mergeMap<StatsEditISO3166SelectedAction, Observable<Action>>((action: StatsEditISO3166SelectedAction) => {
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
                    stats.getLanguageID(),
                    superposition.get(),
                    stats.getTerm(),
                    stats.getName(),
                    stats.getUnit(),
                    stats.getUpdatedAt(),
                    stats.getItems()
                  );

                  return updateStats(newStats);
                })
              );
            }
          )
        );
      })
    );
  }

  public dataFilled(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats
      }
    } = state$;

    return action$.pipe<StatsEditDataFilledAction, Action>(
      ofType<Action, StatsEditDataFilledAction>(STATS_EDIT_DATA_FILLED),
      map<StatsEditDataFilledAction, Action>((action: StatsEditDataFilledAction) => {
        const duplicated: Stats = stats.duplicate();
        duplicated.setData(action.coordinate, action.value);

        return updateStats(duplicated);
      })
    );
  }

  public dataDeleted(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats
      }
    } = state$;

    return action$.pipe<StatsEditDataDeletedAction, Action>(
      ofType<Action, StatsEditDataDeletedAction>(STATS_EDIT_DATA_DELETED),
      map<StatsEditDataDeletedAction, Action>((action: StatsEditDataDeletedAction) => {
        const duplicated: Stats = stats.duplicate();
        duplicated.deleteData(action.coordinate);

        return updateStats(duplicated);
      })
    );
  }

  public itemNameTyped(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        statsItem
      }
    } = state$;

    return action$.pipe<StatsEditItemNameTypedAction, Action>(
      ofType<Action, StatsEditItemNameTypedAction>(STATS_EDIT_ITEM_NAME_TYPED),
      map<StatsEditItemNameTypedAction, Action>((action: StatsEditItemNameTypedAction) => {
        const newStatsItem: StatsItem = StatsItem.of(statsItem.getStatsItemID(), action.name, statsItem.getValues());

        return updateStatsItem(newStatsItem);
      })
    );
  }

  public saveItem(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats,
        statsItem
      }
    } = state$;

    return action$.pipe<Action, Action>(
      ofType<Action, Action>(STATS_EDIT_ITEM_SAVE),
      mergeMap<Action, Observable<Action>>(() => {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          stats.getLanguageID(),
          stats.getRegionID(),
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems().add(statsItem),
          stats.getStartDate()
        );

        return of(updateStats(newStats), resetStatsItem());
      })
    );
  }

  public rowSelected(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats
      }
    } = state$;

    return action$.pipe<StatsEditRowSelectedAction, Action>(
      ofType<Action, StatsEditRowSelectedAction>(STATS_EDIT_ROW_SELECTED),
      map<StatsEditRowSelectedAction, Action>((action: StatsEditRowSelectedAction) => {
        const statsItem: Quantum<StatsItem> = stats.getRow(action.row);

        return selectItem(statsItem, action.row);
      })
    );
  }

  public selectingItemNameTyped(
    action$: ActionsObservable<Action>,
    state$: StateObservable<State>
  ): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats,
        statsEdit: {
          selectingItem,
          selectingRow
        }
      }
    } = state$;

    return action$.pipe<StatsEditSelectingItemNameTypedAction, Action>(
      ofType<Action, StatsEditSelectingItemNameTypedAction>(STATS_EDIT_SELECTING_ITEM_NAME_TYPED),
      mergeMap<StatsEditSelectingItemNameTypedAction, Observable<Action>>(
        (action: StatsEditSelectingItemNameTypedAction) => {
          return EMPTY.pipe<unknown, Action>(
            filter<never>(() => {
              return selectingItem.isPresent();
            }),
            mergeMap<unknown, Observable<Action>>(() => {
              const statsItem: StatsItem = selectingItem.get();
              const newSelectingItem: StatsItem = StatsItem.of(
                statsItem.getStatsItemID(),
                action.name,
                statsItem.getValues()
              );

              const duplicated: Stats = stats.duplicate();
              duplicated.replaceItem(newSelectingItem, selectingRow);

              return of<Action>(updateSelectingItem(Present.of<StatsItem>(newSelectingItem)), updateStats(duplicated));
            })
          );
        }
      )
    );
  }

  public startDateDetermined(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats
      }
    } = state$;

    return action$.pipe<StatsEditStartDateDeterminedAction, Action>(
      ofType<Action, StatsEditStartDateDeterminedAction>(STATS_EDIT_START_DATE_DETERMINED),
      map<StatsEditStartDateDeterminedAction, Action>((action: StatsEditStartDateDeterminedAction) => {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          stats.getLanguageID(),
          stats.getRegionID(),
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems(),
          Present.of<AsOf>(action.startDate)
        );

        return updateStats(newStats);
      })
    );
  }

  public invalidDateInput(action$: ActionsObservable<Action>): Observable<Action> {
    return action$.pipe<Action, Action>(
      ofType<Action, Action>(STATS_EDIT_INVALID_DATE_INPUT),
      mapTo<Action, Action>(appearNotification('error', 'center', 'top', 'INVALID_INPUT_DATE'))
    );
  }

  public rowMoved(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats
      }
    } = state$;

    return action$.pipe<StatsEditRowMovedAction, Action>(
      ofType<Action, StatsEditRowMovedAction>(STATS_EDIT_ROW_MOVED),
      map<StatsEditRowMovedAction, Action>((action: StatsEditRowMovedAction) => {
        const duplicated: Stats = stats.duplicate();
        duplicated.moveItem(action.column, action.target);

        return updateStats(duplicated);
      })
    );
  }

  public invalidValueInput(action$: ActionsObservable<Action>): Observable<Action> {
    return action$.pipe<Action, Action>(
      ofType<Action, Action>(STATS_EDIT_INVALID_VALUE_INPUT),
      mapTo<Action, Action>(appearNotification('warn', 'center', 'top', 'INVALID_INPUT_VALUE'))
    );
  }

  public removeItem(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats
      }
    } = state$;

    return action$.pipe<StatsEditRemoveSelectingItemAction, Action, Action>(
      ofType<Action, StatsEditRemoveSelectingItemAction>(STATS_EDIT_REMOVE_SELECTING_ITEM),
      map<StatsEditRemoveSelectingItemAction, Action>((action: StatsEditRemoveSelectingItemAction) => {
        const duplicated: Stats = stats.duplicate();
        duplicated.removeItem(action.statsItem);

        return updateStats(duplicated);
      }),
      mapTo<Action, Action>(clearSelectingItem())
    );
  }

  public save(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    // prettier-ignore
    const {
      value: {
        stats
      }
    } = state$;

    return action$.pipe<Action, Action, Action>(
      ofType<Action, Action>(STATS_EDIT_SAVE_STATS),
      mapTo<Action, Action>(loading()),
      mergeMap<Action, Observable<Action>>(() => {
        return from<Promise<Superposition<void, DataSourceError>>>(
          this.statsCommand.create(stats, VeauAccountID.generate())
        ).pipe<Action>(
          mergeMap<Superposition<void, DataSourceError>, Observable<Action>>(
            (superposition: Superposition<void, DataSourceError>) => {
              return EMPTY.pipe<Action, Action>(
                mapTo<Action, Action>(loaded()),
                map<Action, Action>(() => {
                  return superposition.match<Action>(
                    () => {
                      return appearNotification('success', 'center', 'top', 'SAVE_SUCCESS');
                    },
                    () => {
                      return raiseModal('STATS_SAVE_FAILURE', 'STATS_SAVE_FAILURE_DESCRIPTION');
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
