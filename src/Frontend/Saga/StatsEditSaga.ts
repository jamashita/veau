// @ts-nocheck
import { DataSourceError, Present, Quantum, Superposition } from 'publikum';
import { SagaIterator } from 'redux-saga';
import { all, call, Effect, fork, put, PutEffect, select, take } from 'redux-saga/effects';

import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
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

export class StatsEditSaga {
  private readonly statsQuery: IStatsQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
    statsQuery: IStatsQuery,
    localeQuery: ILocaleQuery,
    languageQuery: ILanguageQuery,
    regionQuery: IRegionQuery,
    statsCommand: IStatsCommand
  ) {
    this.statsQuery = statsQuery;
    this.localeQuery = localeQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.statsCommand = statsCommand;
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
      const action: StatsEditInitializeAction = yield take(STATS_EDIT_INITIALIZE);

      const { statsID } = action;

      const superposition: Superposition<Stats, NoSuchElementError | StatsError | DataSourceError> = yield call(
        (): Promise<Superposition<Stats, NoSuchElementError | StatsError | DataSourceError>> => {
          return this.statsQuery.findByStatsID(statsID);
        }
      );

      yield superposition.match<Effect>(
        (stats: Stats) => {
          return all([put(updateStats(stats)), put(clearSelectingItem())]);
        },
        (err: NoSuchElementError | StatsError | DataSourceError) => {
          if (err instanceof NoSuchElementError) {
            return all([put(pushToStatsList()), put(appearNotification('error', 'center', 'top', 'STATS_NOT_FOUND'))]);
          }

          return put(pushToStatsList());
        }
      );
    }
  }

  private *initializationFailed(): SagaIterator<unknown> {
    while (true) {
      yield take(STATS_EDIT_INITIALIZATION_FAILURE);

      yield all([put(pushToStatsList()), put(appearNotification('error', 'center', 'top', 'MALFORMAT_STATS_ID'))]);
    }
  }

  private *nameTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditNameTypedAction = yield take(STATS_EDIT_NAME_TYPED);
      const state: State = yield select();

      const { stats } = state;

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

      yield put(updateStats(newStats));
    }
  }

  private *unitTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditUnitTypedAction = yield take(STATS_EDIT_UNIT_TYPED);
      const state: State = yield select();

      const { stats } = state;

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

      yield put(updateStats(newStats));
    }
  }

  private *iso639Selected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditISO639SelectedAction = yield take(STATS_EDIT_ISO639_SELECTED);
      const state: State = yield select();

      const { stats } = state;

      const superposition: Superposition<Language, NoSuchElementError | DataSourceError> = yield call(
        (): Promise<Superposition<Language, NoSuchElementError | DataSourceError>> => {
          return this.languageQuery.findByISO639(action.iso639);
        }
      );

      if (superposition.isAlive()) {
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

        yield put(updateStats(newStats));
      }
    }
  }

  private *iso3166Selected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditISO3166SelectedAction = yield take(STATS_EDIT_ISO3166_SELECTED);
      const state: State = yield select();

      const { stats } = state;

      const superposition: Superposition<Region, NoSuchElementError | DataSourceError> = yield call(
        (): Promise<Superposition<Region, NoSuchElementError | DataSourceError>> => {
          return this.regionQuery.findByISO3166(action.iso3166);
        }
      );

      if (superposition.isAlive()) {
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

        yield put(updateStats(newStats));
      }
    }
  }

  private *dataFilled(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditDataFilledAction = yield take(STATS_EDIT_DATA_FILLED);
      const state: State = yield select();

      const { stats } = state;
      const { coordinate, value } = action;

      const duplicated: Stats = stats.duplicate();
      duplicated.setData(coordinate, value);

      yield put(updateStats(duplicated));
    }
  }

  private *dataDeleted(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditDataDeletedAction = yield take(STATS_EDIT_DATA_DELETED);
      const state: State = yield select();

      const { stats } = state;
      const { coordinate } = action;

      const duplicated: Stats = stats.duplicate();
      duplicated.deleteData(coordinate);

      yield put(updateStats(duplicated));
    }
  }

  private *itemNameTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditItemNameTypedAction = yield take(STATS_EDIT_ITEM_NAME_TYPED);
      const state: State = yield select();

      const { statsItem } = state;
      const { name } = action;

      const newStatsItem: StatsItem = StatsItem.of(statsItem.getStatsItemID(), name, statsItem.getValues());

      yield put(updateStatsItem(newStatsItem));
    }
  }

  private *saveItem(): SagaIterator<unknown> {
    while (true) {
      yield take(STATS_EDIT_ITEM_SAVE);
      const state: State = yield select();

      const { stats, statsItem } = state;

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

      yield all([put(updateStats(newStats)), put(resetStatsItem())]);
    }
  }

  private *rowSelected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditRowSelectedAction = yield take(STATS_EDIT_ROW_SELECTED);
      const state: State = yield select();

      const { stats } = state;
      const { row } = action;

      const statsItem: Quantum<StatsItem> = stats.getRow(row);

      yield put(selectItem(statsItem, row));
    }
  }

  private *selectingItemNameTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditSelectingItemNameTypedAction = yield take(STATS_EDIT_SELECTING_ITEM_NAME_TYPED);
      const state: State = yield select();

      const {
        stats,
        statsEdit: { selectingItem, selectingRow }
      } = state;
      const { name } = action;

      if (selectingItem.isAbsent()) {
        continue;
      }

      const statsItem: StatsItem = selectingItem.get();
      const newSelectingItem: StatsItem = StatsItem.of(statsItem.getStatsItemID(), name, statsItem.getValues());
      const duplicated: Stats = stats.duplicate();
      duplicated.replaceItem(newSelectingItem, selectingRow);

      yield all([put(updateSelectingItem(Present.of<StatsItem>(newSelectingItem))), put(updateStats(duplicated))]);
    }
  }

  private *startDateDetermined(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditStartDateDeterminedAction = yield take(STATS_EDIT_START_DATE_DETERMINED);
      const state: State = yield select();

      const { stats } = state;
      const { startDate } = action;

      const newStats: Stats = Stats.of(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        stats.getName(),
        stats.getUnit(),
        stats.getUpdatedAt(),
        stats.getItems(),
        Present.of<AsOf>(startDate)
      );

      yield put(updateStats(newStats));
    }
  }

  private *invalidDateInput(): SagaIterator<unknown> {
    while (true) {
      yield take(STATS_EDIT_INVALID_DATE_INPUT);

      yield put(appearNotification('error', 'center', 'top', 'INVALID_INPUT_DATE'));
    }
  }

  private *rowMoved(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditRowMovedAction = yield take(STATS_EDIT_ROW_MOVED);
      const state: State = yield select();

      const { stats } = state;
      const { column, target } = action;

      const duplicated: Stats = stats.duplicate();
      duplicated.moveItem(column, target);

      yield put(updateStats(duplicated));
    }
  }

  private *invalidValueInput(): SagaIterator<unknown> {
    while (true) {
      yield take(STATS_EDIT_INVALID_VALUE_INPUT);
      yield put(appearNotification('warn', 'center', 'top', 'INVALID_INPUT_VALUE'));
    }
  }

  private *removeItem(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditRemoveSelectingItemAction = yield take(STATS_EDIT_REMOVE_SELECTING_ITEM);
      const state: State = yield select();

      const { stats } = state;

      const duplicated: Stats = stats.duplicate();
      duplicated.removeItem(action.statsItem);

      yield all([put(updateStats(duplicated)), put(clearSelectingItem())]);
    }
  }

  private *save(): SagaIterator<unknown> {
    while (true) {
      yield take(STATS_EDIT_SAVE_STATS);
      const state: State = yield select();

      const { stats } = state;

      yield put(loading());

      const superposition: Superposition<void, DataSourceError> = yield call(
        (): Promise<Superposition<void, DataSourceError>> => {
          return this.statsCommand.create(stats, VeauAccountID.generate());
        }
      );

      yield put(loaded());

      yield superposition.match<PutEffect<Action>>(
        () => {
          return put(appearNotification('success', 'center', 'top', 'SAVE_SUCCESS'));
        },
        () => {
          return put(raiseModal('STATS_SAVE_FAILURE', 'STATS_SAVE_FAILURE_DESCRIPTION'));
        }
      );
    }
  }
}
