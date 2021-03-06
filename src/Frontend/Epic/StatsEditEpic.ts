import { DataSourceError } from '@jamashita/publikum-error';
import { Kind, Nullable } from '@jamashita/publikum-type';
import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, from, merge, Observable, of } from 'rxjs';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { StatsItems } from '../../Entity/StatsItem/StatsItems';
import { NoSuchElementError } from '../../Query/Error/NoSuchElementError';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { IRegionQuery } from '../../Query/Interface/IRegionQuery';
import { IStatsQuery } from '../../Query/Interface/IStatsQuery';
import { Language } from '../../VO/Language/Language';
import { Region } from '../../VO/Region/Region';
import { StatsError } from '../../VO/StatsOutline/Error/StatsError';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
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
    @inject(Type.StatsAJAXQuery) statsQuery: IStatsQuery,
    @inject(Type.LanguageVaultQuery) languageQuery: ILanguageQuery,
    @inject(Type.RegionVaultQuery) regionQuery: IRegionQuery,
    @inject(Type.StatsAJAXCommand) statsCommand: IStatsCommand
  ) {
    this.statsQuery = statsQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.statsCommand = statsCommand;
  }

  public init(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return merge<VeauAction>(
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

  public findStats(action$: Observable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<StatsEditInitializeAction, VeauAction>(
      ofType<VeauAction, StatsEditInitializeAction>(STATS_EDIT_INITIALIZE),
      mergeMap<StatsEditInitializeAction, Observable<VeauAction>>((action: StatsEditInitializeAction) => {
        return from<Promise<Observable<VeauAction>>>(
          this.statsQuery.findByStatsID(action.statsID).transform<Observable<VeauAction>, Error>((stats: Stats) => {
            return of<VeauAction>(updateStats(stats), clearSelectingItem());
          }, (err: StatsError | NoSuchElementError | DataSourceError) => {
            if (err instanceof NoSuchElementError) {
              return of<VeauAction>(
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

  public initializationFailed(action$: Observable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(STATS_EDIT_INITIALIZATION_FAILURE),
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        return concat<VeauAction>(
          of<VeauAction>(pushToStatsList(), appearNotification('error', 'center', 'top', 'MALFORMAT_STATS_ID'))
        );
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

        return of<VeauAction>(
          updateStats(newStats),
          resetStatsItem()
        );
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

        return of<VeauAction>(
          selectItem(item, action.row),
          updateStats(stats)
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

          return of<VeauAction>(
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

  public invalidDateInput(action$: Observable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(STATS_EDIT_INVALID_DATE_INPUT),
      mapTo<VeauAction, VeauAction>(appearNotification('error', 'center', 'top', 'INVALID_INPUT_DATE'))
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

  public invalidValueInput(action$: Observable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(STATS_EDIT_INVALID_VALUE_INPUT),
      mapTo<VeauAction, VeauAction>(appearNotification('warn', 'center', 'top', 'INVALID_INPUT_VALUE'))
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

          return of<VeauAction>(updateStats(stats), clearSelectingItem());
        }
      )
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

        return concat<VeauAction>(
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
}
