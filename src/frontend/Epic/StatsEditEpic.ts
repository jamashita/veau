import { Kind, Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, from, merge, Observable, of } from 'rxjs';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import { Type } from '../../container/Types';
import { Stats } from '../../domain/entity/Stats/Stats';
import { StatsItem } from '../../domain/entity/StatsItem/StatsItem';
import { StatsItems } from '../../domain/entity/StatsItem/StatsItems';
import { Language } from '../../domain/vo/Language/Language';
import { Region } from '../../domain/vo/Region/Region';
import { StatsError } from '../../domain/vo/StatsOutline/error/StatsError';
import { StatsOutline } from '../../domain/vo/StatsOutline/StatsOutline';
import { VeauAccountID } from '../../domain/vo/VeauAccount/VeauAccountID';
import { IStatsCommand } from '../../repository/command/interface/IStatsCommand';
import { NoSuchElementError } from '../../repository/query/error/NoSuchElementError';
import { ILanguageQuery } from '../../repository/query/interface/ILanguageQuery';
import { IRegionQuery } from '../../repository/query/interface/IRegionQuery';
import { IStatsQuery } from '../../repository/query/interface/IStatsQuery';
import {
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
  StatsEditUnitTypedAction,
  VeauAction
} from '../Action';
import { loaded, loading } from '../ActionCreator/LoadingActionCreator';
import { raiseModal } from '../ActionCreator/ModalActionCreator';
import { nothing } from '../ActionCreator/NothingActionCreator';
import { appearNotification } from '../ActionCreator/NotificationActionCreator';
import { pushToStatsList } from '../ActionCreator/RedirectActionCreator';
import {
  clearSelectingItem,
  resetStatsItem,
  selectItem,
  updateSelectingItem,
  updateStats,
  updateStatsItem
} from '../ActionCreator/StatsEditActionCreator';
import { State } from '../State';

@injectable()
export class StatsEditEpic {
  private readonly statsQuery: IStatsQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
    @inject(Type.StatsFetchQuery) statsQuery: IStatsQuery,
    @inject(Type.LanguageBinQuery) languageQuery: ILanguageQuery,
    @inject(Type.RegionBinQuery) regionQuery: IRegionQuery,
    @inject(Type.StatsFetchCommand) statsCommand: IStatsCommand
  ) {
    this.statsQuery = statsQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.statsCommand = statsCommand;
  }

  public dataDeleted(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsEditDataDeletedAction, VeauAction>(
      ofType<VeauAction, StatsEditDataDeletedAction>(STATS_EDIT_DATA_DELETED),
      mergeMap<StatsEditDataDeletedAction, Observable<VeauAction>>((action: StatsEditDataDeletedAction) => {
        const {
          value: {
            statsEdit: {
              stats
            }
          }
        } = state$;

        const duplicated: Stats = stats.duplicate();

        duplicated.deleteData(action.coordinate);

        return of<VeauAction>(updateStats(duplicated));
      })
    );
  }

  public dataFilled(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsEditDataFilledAction, VeauAction>(
      ofType<VeauAction, StatsEditDataFilledAction>(STATS_EDIT_DATA_FILLED),
      mergeMap<StatsEditDataFilledAction, Observable<VeauAction>>((action: StatsEditDataFilledAction) => {
        const {
          value: {
            statsEdit: {
              stats
            }
          }
        } = state$;

        const duplicated: Stats = stats.duplicate();

        duplicated.setData(action.coordinate, action.value);

        return of<VeauAction>(updateStats(duplicated));
      })
    );
  }

  public findStats(action$: Observable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<StatsEditInitializeAction, VeauAction>(
      ofType<VeauAction, StatsEditInitializeAction>(STATS_EDIT_INITIALIZE),
      mergeMap<StatsEditInitializeAction, Observable<VeauAction>>((action: StatsEditInitializeAction) => {
        return from<Promise<Observable<VeauAction>>>(
          this.statsQuery.findByStatsID(action.statsID).transform<Observable<VeauAction>, Error>((stats: Stats) => {
            return of<Array<VeauAction>>(updateStats(stats), clearSelectingItem());
          }, (err: DataSourceError | NoSuchElementError | StatsError) => {
            if (err instanceof NoSuchElementError) {
              return of<Array<VeauAction>>(
                pushToStatsList(),
                appearNotification('error', 'center', 'top', 'STATS_NOT_FOUND')
              );
            }

            return of<VeauAction>(pushToStatsList());
          }).get()
        ).pipe<VeauAction>(
          mergeMap<Observable<VeauAction>, Observable<VeauAction>>((observable: Observable<VeauAction>) => {
            return observable;
          })
        );
      })
    );
  }

  public init(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return merge<Array<VeauAction>>(
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

  public initializationFailed(action$: Observable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(STATS_EDIT_INITIALIZATION_FAILURE),
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        return concat<Array<VeauAction>>(
          of<Array<VeauAction>>(pushToStatsList(), appearNotification('error', 'center', 'top', 'MALFORMAT_STATS_ID'))
        );
      })
    );
  }

  public invalidDateInput(action$: Observable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(STATS_EDIT_INVALID_DATE_INPUT),
      mapTo<VeauAction, VeauAction>(appearNotification('error', 'center', 'top', 'INVALID_INPUT_DATE'))
    );
  }

  public invalidValueInput(action$: Observable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(STATS_EDIT_INVALID_VALUE_INPUT),
      mapTo<VeauAction, VeauAction>(appearNotification('warn', 'center', 'top', 'INVALID_INPUT_VALUE'))
    );
  }

  public iso3166Selected(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsEditISO3166SelectedAction, VeauAction>(
      ofType<VeauAction, StatsEditISO3166SelectedAction>(STATS_EDIT_ISO3166_SELECTED),
      mergeMap<StatsEditISO3166SelectedAction, Observable<VeauAction>>((action: StatsEditISO3166SelectedAction) => {
        const {
          value: {
            statsEdit: {
              stats
            }
          }
        } = state$;

        return from<Promise<Observable<VeauAction>>>(
          this.regionQuery.findByISO3166(action.iso3166).transform<Observable<VeauAction>, Error>((region: Region) => {
            const newStats: Stats = Stats.of(
              stats.getOutline(),
              stats.getLanguage(),
              region,
              stats.getTerm(),
              stats.getItems()
            );

            return of<VeauAction>(updateStats(newStats));
          }, () => {
            return of<VeauAction>();
          }).get()
        ).pipe<VeauAction>(
          mergeMap<Observable<VeauAction>, Observable<VeauAction>>((observable: Observable<VeauAction>) => {
            return observable;
          })
        );
      })
    );
  }

  public iso639Selected(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsEditISO639SelectedAction, VeauAction>(
      ofType<VeauAction, StatsEditISO639SelectedAction>(STATS_EDIT_ISO639_SELECTED),
      mergeMap<StatsEditISO639SelectedAction, Observable<VeauAction>>((action: StatsEditISO639SelectedAction) => {
        const {
          value: {
            statsEdit: {
              stats
            }
          }
        } = state$;

        return from<Promise<Observable<VeauAction>>>(
          this.languageQuery.findByISO639(action.iso639).transform<Observable<VeauAction>, Error>((language: Language) => {
            const newStats: Stats = Stats.of(
              stats.getOutline(),
              language,
              stats.getRegion(),
              stats.getTerm(),
              stats.getItems()
            );

            return of<VeauAction>(updateStats(newStats));
          }, () => {
            return of<VeauAction>(nothing());
          }).get()
        ).pipe<VeauAction>(
          mergeMap<Observable<VeauAction>, Observable<VeauAction>>((observable: Observable<VeauAction>) => {
            return observable;
          })
        );
      })
    );
  }

  public itemNameTyped(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsEditItemNameTypedAction, VeauAction>(
      ofType<VeauAction, StatsEditItemNameTypedAction>(STATS_EDIT_ITEM_NAME_TYPED),
      map<StatsEditItemNameTypedAction, VeauAction>((action: StatsEditItemNameTypedAction) => {
        const {
          value: {
            statsEdit: {
              item
            }
          }
        } = state$;

        const newStatsItem: StatsItem = StatsItem.of(item.getStatsItemID(), action.name, item.getValues());

        return updateStatsItem(newStatsItem);
      })
    );
  }

  public nameTyped(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsEditNameTypedAction, VeauAction>(
      ofType<VeauAction, StatsEditNameTypedAction>(STATS_EDIT_NAME_TYPED),
      mergeMap<StatsEditNameTypedAction, Observable<VeauAction>>((action: StatsEditNameTypedAction) => {
        const {
          value: {
            statsEdit: {
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

        return of<VeauAction>(updateStats(newStats));
      })
    );
  }

  public removeItem(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsEditRemoveSelectingItemAction, VeauAction>(
      ofType<VeauAction, StatsEditRemoveSelectingItemAction>(STATS_EDIT_REMOVE_SELECTING_ITEM),
      mergeMap<StatsEditRemoveSelectingItemAction, Observable<VeauAction>>(
        (action: StatsEditRemoveSelectingItemAction) => {
          const {
            value: {
              statsEdit: {
                stats
              }
            }
          } = state$;

          stats.removeItem(action.item);

          return of<Array<VeauAction>>(updateStats(stats), clearSelectingItem());
        }
      )
    );
  }

  public rowMoved(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsEditRowMovedAction, VeauAction>(
      ofType<VeauAction, StatsEditRowMovedAction>(STATS_EDIT_ROW_MOVED),
      mergeMap<StatsEditRowMovedAction, Observable<VeauAction>>((action: StatsEditRowMovedAction) => {
        const {
          value: {
            statsEdit: {
              stats
            }
          }
        } = state$;

        stats.moveItem(action.column, action.target);

        return of<VeauAction>(updateStats(stats));
      })
    );
  }

  public rowSelected(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsEditRowSelectedAction, VeauAction>(
      ofType<VeauAction, StatsEditRowSelectedAction>(STATS_EDIT_ROW_SELECTED),
      mergeMap<StatsEditRowSelectedAction, Observable<VeauAction>>((action: StatsEditRowSelectedAction) => {
        const {
          value: {
            statsEdit: {
              stats
            }
          }
        } = state$;

        const item: Nullable<StatsItem> = stats.getRow(action.row);

        if (Kind.isNull(item)) {
          return of<VeauAction>(nothing());
        }

        return of<Array<VeauAction>>(
          selectItem(item, action.row),
          updateStats(stats)
        );
      })
    );
  }

  public save(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(STATS_EDIT_SAVE_STATS),
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        const {
          value: {
            statsEdit: {
              stats
            }
          }
        } = state$;

        return concat<Array<VeauAction>>(
          of<VeauAction>(loading()),
          from<Promise<Observable<VeauAction>>>(
            this.statsCommand.create(stats, VeauAccountID.generate()).transform(
              () => {
                return of<VeauAction>(appearNotification('success', 'center', 'top', 'SAVE_SUCCESS'));
              },
              () => {
                return of<VeauAction>(raiseModal('STATS_SAVE_FAILURE', 'STATS_SAVE_FAILURE_DESCRIPTION'));
              }
            ).get()
          ).pipe<VeauAction>(
            mergeMap<Observable<VeauAction>, Observable<VeauAction>>((observable: Observable<VeauAction>) => {
              return observable;
            })
          ),
          of<VeauAction>(loaded())
        );
      })
    );
  }

  public saveItem(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(STATS_EDIT_ITEM_SAVE),
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        const {
          value: {
            statsEdit: {
              stats,
              item
            }
          }
        } = state$;

        const items: StatsItems = stats.getItems();

        items.add(item);

        const newStats: Stats = Stats.of(
          stats.getOutline(),
          stats.getLanguage(),
          stats.getRegion(),
          stats.getTerm(),
          items,
          stats.getStartDate()
        );

        return of<Array<VeauAction>>(
          updateStats(newStats),
          resetStatsItem()
        );
      })
    );
  }

  public selectingItemNameTyped(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsEditSelectingItemNameTypedAction, VeauAction>(
      ofType<VeauAction, StatsEditSelectingItemNameTypedAction>(STATS_EDIT_SELECTING_ITEM_NAME_TYPED),
      mergeMap<StatsEditSelectingItemNameTypedAction, Observable<VeauAction>>(
        (action: StatsEditSelectingItemNameTypedAction) => {
          const {
            value: {
              statsEdit: {
                stats,
                selectingItem,
                selectingRow
              }
            }
          } = state$;

          if (Kind.isNull(selectingItem)) {
            return of<VeauAction>(nothing());
          }

          const newSelectingItem: StatsItem = StatsItem.of(
            selectingItem.getStatsItemID(),
            action.name,
            selectingItem.getValues()
          );

          stats.replaceItem(newSelectingItem, selectingRow);

          return of<Array<VeauAction>>(
            updateSelectingItem(newSelectingItem),
            updateStats(stats)
          );
        }
      )
    );
  }

  public startDateDetermined(
    action$: ActionsObservable<VeauAction>,
    state$: StateObservable<State>
  ): Observable<VeauAction> {
    return action$.pipe<StatsEditStartDateDeterminedAction, VeauAction>(
      ofType<VeauAction, StatsEditStartDateDeterminedAction>(STATS_EDIT_START_DATE_DETERMINED),
      mergeMap<StatsEditStartDateDeterminedAction, Observable<VeauAction>>(
        (action: StatsEditStartDateDeterminedAction) => {
          const {
            value: {
              statsEdit: {
                stats
              }
            }
          } = state$;

          const newStats: Stats = Stats.of(
            stats.getOutline(),
            stats.getLanguage(),
            stats.getRegion(),
            stats.getTerm(),
            stats.getItems(),
            action.startDate
          );

          return of<VeauAction>(updateStats(newStats));
        }
      )
    );
  }

  public unitTyped(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsEditUnitTypedAction, VeauAction>(
      ofType<VeauAction, StatsEditUnitTypedAction>(STATS_EDIT_UNIT_TYPED),
      mergeMap<StatsEditUnitTypedAction, Observable<VeauAction>>((action: StatsEditUnitTypedAction) => {
        const {
          value: {
            statsEdit: {
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

        return of<VeauAction>(updateStats(newStats));
      })
    );
  }
}
