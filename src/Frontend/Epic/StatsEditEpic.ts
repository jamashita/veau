import { inject, injectable } from 'inversify';
import { ofType, StateObservable } from 'redux-observable';
import { EMPTY, from, merge, Observable, of } from 'rxjs';
import { filter, map, mapTo, mergeMap } from 'rxjs/operators';
import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { TYPE } from '../../Container/Types';
import { Stats } from '../../Entity/Stats';
import { StatsItem } from '../../Entity/StatsItem';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { DataSourceError } from '../../General/DataSourceError';
import { Present } from '../../General/Quantum/Present';
import { Quantum } from '../../General/Quantum/Quantum';
import { Superposition } from '../../General/Superposition/Superposition';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { ILocaleQuery } from '../../Query/Interface/ILocaleQuery';
import { IRegionQuery } from '../../Query/Interface/IRegionQuery';
import { IStatsQuery } from '../../Query/Interface/IStatsQuery';
import { Language } from '../../VO/Language';
import { Region } from '../../VO/Region';
import {
  Action,
  STATS_EDIT_DATA_DELETED,
  STATS_EDIT_DATA_FILLED,
  STATS_EDIT_INITIALIZATION_FAILURE,
  STATS_EDIT_INITIALIZE,
  STATS_EDIT_ISO3166_SELECTED,
  STATS_EDIT_ISO639_SELECTED,
  STATS_EDIT_ITEM_NAME_TYPED,
  STATS_EDIT_ITEM_SAVE,
  STATS_EDIT_NAME_TYPED,
  STATS_EDIT_ROW_SELECTED,
  STATS_EDIT_SELECTING_ITEM_NAME_TYPED,
  STATS_EDIT_UNIT_TYPED,
  StatsEditDataDeletedAction,
  StatsEditDataFilledAction,
  StatsEditInitializeAction,
  StatsEditISO3166SelectedAction,
  StatsEditISO639SelectedAction,
  StatsEditItemNameTypedAction,
  StatsEditNameTypedAction,
  StatsEditRowSelectedAction,
  StatsEditSelectingItemNameTypedAction,
  StatsEditUnitTypedAction
} from '../Action/Action';
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
    A;
  }

  public init(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge(
      this.findStats(action$),
      this.initializationFailed(action$),
      this.nameTyped(action$, state$)
    );
  }

  public findStats(action$: Observable<Action>): Observable<Action> {
    return action$.pipe<StatsEditInitializeAction, Action>(
      ofType<Action, StatsEditInitializeAction>(STATS_EDIT_INITIALIZE),
      mergeMap<StatsEditInitializeAction, Observable<Action>>((action: StatsEditInitializeAction) => {
        return from<Promise<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>>>(
          this.statsQuery.findByStatsID(action.statsID)
        ).pipe<Action>(
          mergeMap<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>, Observable<Action>>((superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>) => {
            return superposition.match<Observable<Action>>((stats: Stats) => {
              return of<Action>(
                updateStats(stats),
                clearSelectingItem()
              );
            }, (err: StatsError | NoSuchElementError | DataSourceError) => {
              if (err instanceof NoSuchElementError) {
                return of<Action>(
                  pushToStatsList(),
                  appearNotification('error', 'center', 'top', 'STATS_NOT_FOUND')
                );
              }

              return of<Action>(pushToStatsList());
            });
          })
        );
      })
    );
  }

  public initializationFailed(action$: Observable<Action>): Observable<Action> {
    return action$.pipe<Action, Action, Action>(
      ofType<Action, Action>(STATS_EDIT_INITIALIZATION_FAILURE),
      mapTo<Action, Action>(pushToStatsList()),
      mapTo<Action, Action>(appearNotification('error', 'center', 'top', 'MALFORMAT_STATS_ID'))
    );
  }

  public nameTyped(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
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
          stats.getLanguage(),
          stats.getRegion(),
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

  public unitTyped(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
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
          stats.getLanguage(),
          stats.getRegion(),
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

  public iso639Selected(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
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
          mergeMap<Superposition<Language, NoSuchElementError | DataSourceError>, Observable<Action>>((superposition: Superposition<Language, NoSuchElementError | DataSourceError>) => {
            return EMPTY.pipe<never, Action>(
              filter<never>(() => {
                return superposition.isSuccess();
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

                return updateStats(newStats);
              })
            );
          })
        );
      })
    );
  }

  public iso3166Selected(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
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
          mergeMap<Superposition<Region, NoSuchElementError | DataSourceError>, Observable<Action>>((superposition: Superposition<Region, NoSuchElementError | DataSourceError>) => {
            return EMPTY.pipe<never, Action>(
              filter<never>(() => {
                return superposition.isSuccess();
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

                return updateStats(newStats);
              })
            );
          })
        );
      })
    );
  }

  public dataFilled(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
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

  public dataDeleted(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
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

  public itemNameTyped(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    const {
      value: {
        statsItem
      }
    } = state$;

    return action$.pipe<StatsEditItemNameTypedAction, Action>(
      ofType<Action, StatsEditItemNameTypedAction>(STATS_EDIT_ITEM_NAME_TYPED),
      map<StatsEditItemNameTypedAction, Action>((action: StatsEditItemNameTypedAction) => {

        const newStatsItem: StatsItem = StatsItem.of(
          statsItem.getStatsItemID(),
          action.name,
          statsItem.getValues()
        );

        return updateStatsItem(newStatsItem);
      })
    );
  }

  public saveItem(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
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
          stats.getLanguage(),
          stats.getRegion(),
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems().add(statsItem),
          stats.getStartDate()
        );

        return of(
          updateStats(newStats),
          resetStatsItem()
        );
      })
    );
  }

  public rowSelected(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
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

  public selectingItemNameTyped(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
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
      mergeMap<StatsEditSelectingItemNameTypedAction, Observable<Action>>((action: StatsEditSelectingItemNameTypedAction) => {
        return EMPTY.pipe<unknown, Action>(
          filter<never>(selectingItem.isPresent),
          mergeMap<unknown, Observable<Action>>(() => {
            const statsItem: StatsItem = selectingItem.get();
            const newSelectingItem: StatsItem = StatsItem.of(
              statsItem.getStatsItemID(),
              action.name,
              statsItem.getValues()
            );

            const duplicated: Stats = stats.duplicate();
            duplicated.replaceItem(newSelectingItem, selectingRow);

            return of<Action>(
              updateSelectingItem(Present.of<StatsItem>(newSelectingItem)),
              updateStats(duplicated)
            );
          })
        );
      })
    );
  }
}
