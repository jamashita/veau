import { inject, injectable } from 'inversify';
import { SagaIterator } from 'redux-saga';
import { all, call, Effect, fork, put, PutEffect, select, take } from 'redux-saga/effects';
import { TYPE } from '../../veau-container/Types';
import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { StatsError } from '../../veau-error/StatsError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { None } from '../../veau-general/Optional/None';
import { Optional } from '../../veau-general/Optional/Optional';
import { Some } from '../../veau-general/Optional/Some';
import { Try } from '../../veau-general/Try/Try';
import { ILanguageQuery } from '../../veau-query/interfaces/ILanguageQuery';
import { ILocaleQuery } from '../../veau-query/interfaces/ILocaleQuery';
import { IRegionQuery } from '../../veau-query/interfaces/IRegionQuery';
import { IStatsQuery } from '../../veau-query/interfaces/IStatsQuery';
import { AsOf } from '../../veau-vo/AsOf';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';
import {
  Action,
  ACTION,
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
} from '../actions/Action';
import { loaded, loading } from '../actions/LoadingAction';
import { raiseModal } from '../actions/ModalAction';
import { appearNotification } from '../actions/NotificationAction';
import { pushToStatsList } from '../actions/RedirectAction';
import { resetStatsItem, updateStats, updateStatsItem } from '../actions/StatsAction';
import { clearSelectingItem, selectItem, updateSelectingItem } from '../actions/StatsEditAction';
import { State } from '../State';

@injectable()
export class StatsEditSaga {
  private readonly statsQuery: IStatsQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;

  public constructor(@inject(TYPE.StatsAJAXQuery) statsQuery: IStatsQuery,
    @inject(TYPE.LocaleVaultQuery) localeQuery: ILocaleQuery,
    @inject(TYPE.LanguageVaultQuery) languageQuery: ILanguageQuery,
    @inject(TYPE.RegionVaultQuery) regionQuery: IRegionQuery
  ) {
    this.statsQuery = statsQuery;
    this.localeQuery = localeQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
  }

  public *init(): IterableIterator<unknown> {
    yield fork(this.findStats);
    yield fork(this.initializationFailed);
    yield fork(this.nameTyped);
    yield fork(this.unitTyped);
    yield fork(this.iso639Selected);
    yield fork(this.iso3166Selected);
    yield fork(this.dataFilled);
    yield fork(this.dataDeleted);
    yield fork(this.itemNameTyped);
    yield fork(this.saveItem);
    yield fork(this.rowSelected);
    yield fork(this.selectingItemNameTyped);
    yield fork(this.startDateDetermined);
    yield fork(this.invalidDateInput);
    yield fork(this.invalidValueInput);
    yield fork(this.removeItem);
    yield fork(this.rowMoved);
    yield fork(this.save);
  }

  private *findStats(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditInitializeAction = yield take(ACTION.STATS_EDIT_INITIALIZE);

      const {
        statsID
      } = action;

      const trial: Try<Stats, NoSuchElementError | StatsError | DataSourceError> = yield call((): Promise<Try<Stats, NoSuchElementError | StatsError | DataSourceError>> => {
        return this.statsQuery.findByStatsID(statsID);
      });

      yield trial.match<Effect>((stats: Stats) => {
        return all([
          put(updateStats(stats)),
          put(clearSelectingItem())
        ]);
      }, (err: NoSuchElementError | StatsError | DataSourceError) => {
        if (err instanceof NoSuchElementError) {
          return all([
            put(pushToStatsList()),
            put(appearNotification('error', 'center', 'top', 'STATS_NOT_FOUND'))
          ]);
        }

        return put(pushToStatsList());
      });
    }
  }

  private *initializationFailed(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_INITIALIZATION_FAILURE);

      yield all([
        put(pushToStatsList()),
        put(appearNotification('error', 'center', 'top', 'MALFORMAT_STATS_ID'))
      ]);
    }
  }

  private *nameTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditNameTypedAction = yield take(ACTION.STATS_EDIT_NAME_TYPED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = Stats.of(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        action.name,
        stats.getUnit(),
        stats.getUpdatedAt(),
        stats.getItems(),
        None.of<AsOf>()
      );

      yield put(updateStats(newStats));
    }
  }

  private *unitTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditUnitTypedAction = yield take(ACTION.STATS_EDIT_UNIT_TYPED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = Stats.of(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        stats.getName(),
        action.unit,
        stats.getUpdatedAt(),
        stats.getItems(),
        None.of<AsOf>()
      );

      yield put(updateStats(newStats));
    }
  }

  private *iso639Selected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditISO639SelectedAction = yield take(ACTION.STATS_EDIT_ISO639_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const trial: Try<Language, NoSuchElementError | DataSourceError> = yield call((): Promise<Try<Language, NoSuchElementError | DataSourceError>> => {
        return this.languageQuery.findByISO639(action.iso639);
      });

      if (trial.isSuccess()) {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          trial.get(),
          stats.getRegion(),
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems(),
          None.of<AsOf>()
        );

        yield put(updateStats(newStats));
      }
    }
  }

  private *iso3166Selected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditISO3166SelectedAction = yield take(ACTION.STATS_EDIT_ISO3166_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const trial: Try<Region, NoSuchElementError | DataSourceError> = yield call((): Promise<Try<Region, NoSuchElementError | DataSourceError>> => {
        return this.regionQuery.findByISO3166(action.iso3166);
      });

      if (trial.isSuccess()) {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          stats.getLanguage(),
          trial.get(),
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems(),
          None.of<AsOf>()
        );

        yield put(updateStats(newStats));
      }
    }
  }

  private *dataFilled(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditDataFilledAction = yield take(ACTION.STATS_EDIT_DATA_FILLED);
      const state: State = yield select();

      const {
        stats
      } = state;
      const {
        coordinate,
        value
      } = action;

      const copied: Stats = stats.copy();
      copied.setData(coordinate, value);

      yield put(updateStats(copied));
    }
  }

  private *dataDeleted(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditDataDeletedAction = yield take(ACTION.STATS_EDIT_DATA_DELETED);
      const state: State = yield select();

      const {
        stats
      } = state;
      const {
        coordinate
      } = action;

      const copied: Stats = stats.copy();
      copied.deleteData(coordinate);

      yield put(updateStats(copied));
    }
  }

  private *itemNameTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditItemNameTypedAction = yield take(ACTION.STATS_EDIT_ITEM_NAME_TYPED);
      const state: State = yield select();

      const {
        statsItem
      } = state;
      const {
        name
      } = action;

      const newStatsItem: StatsItem = StatsItem.of(statsItem.getStatsItemID(), name, statsItem.getValues());

      yield put(updateStatsItem(newStatsItem));
    }
  }

  private *saveItem(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_ITEM_SAVE);
      const state: State = yield select();

      const {
        stats,
        statsItem
      } = state;

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

      yield all([
        put(updateStats(newStats)),
        put(resetStatsItem())
      ]);
    }
  }

  private *rowSelected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditRowSelectedAction = yield take(ACTION.STATS_EDIT_ROW_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;
      const {
        row
      } = action;

      const op: Optional<StatsItem> = stats.getRow(row);

      if (op.isPresent()) {
        yield put(selectItem(op.get(), row));
      }
    }
  }

  private *selectingItemNameTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditSelectingItemNameTypedAction = yield take(ACTION.STATS_EDIT_SELECTING_ITEM_NAME_TYPED);
      const state: State = yield select();

      const {
        stats,
        statsEdit: {
          selectingItem,
          selectingRow
        }
      } = state;
      const {
        name
      } = action;

      if (selectingItem === undefined) {
        continue;
      }

      const newSelectingItem: StatsItem = StatsItem.of(selectingItem.getStatsItemID(), name, selectingItem.getValues());
      const copied: Stats = stats.copy();
      copied.replaceItem(newSelectingItem, selectingRow);

      yield all([
        put(updateSelectingItem(newSelectingItem)),
        put(updateStats(copied))
      ]);
    }
  }

  private *startDateDetermined(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditStartDateDeterminedAction = yield take(ACTION.STATS_EDIT_START_DATE_DETERMINED);
      const state: State = yield select();

      const {
        stats
      } = state;
      const {
        startDate
      } = action;

      const newStats: Stats = Stats.of(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        stats.getName(),
        stats.getUnit(),
        stats.getUpdatedAt(),
        stats.getItems(),
        Some.of<AsOf>(startDate)
      );

      yield put(updateStats(newStats));
    }
  }

  private *invalidDateInput(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_INVALID_DATE_INPUT);

      yield put(appearNotification('error', 'center', 'top', 'INVALID_INPUT_DATE'));
    }
  }

  private *rowMoved(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditRowMovedAction = yield take(ACTION.STATS_EDIT_ROW_MOVED);
      const state: State = yield select();

      const {
        stats
      } = state;
      const {
        column,
        target
      } = action;

      const copied: Stats = stats.copy();
      copied.moveItem(column, target);

      yield put(updateStats(copied));
    }
  }

  private *invalidValueInput(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_INVALID_VALUE_INPUT);
      yield put(appearNotification('warn', 'center', 'top', 'INVALID_INPUT_VALUE'));
    }
  }

  private *removeItem(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditRemoveSelectingItemAction = yield take(ACTION.STATS_EDIT_REMOVE_SELECTING_ITEM);
      const state: State = yield select();

      const {
        stats
      } = state;

      const copied: Stats = stats.copy();
      copied.removeItem(action.statsItem);

      yield all([
        put(updateStats(copied)),
        put(clearSelectingItem())
      ]);
    }
  }

  private *save(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_SAVE_STATS);
      const state: State = yield select();

      const {
        stats
      } = state;

      yield put(loading());

      const trial: Try<void, DataSourceError> = yield call((): Promise<Try<void, DataSourceError>> => {
        // TODO
        return this.statsCommand.create(stats);
      });

      yield put(loaded());

      yield trial.match<PutEffect<Action>>(() => {
        return put(appearNotification('success', 'center', 'top', 'SAVE_SUCCESS'));
      }, () => {
        return put(raiseModal('STATS_SAVE_FAILURE', 'STATS_SAVE_FAILURE_DESCRIPTION'));
      });
    }
  }
}
