import * as moment from 'moment';
import { call, fork, put, select, take } from 'redux-saga/effects';
import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsFactory } from '../../veau-factory/StatsFactory';
import { StatsItemFactory } from '../../veau-factory/StatsItemFactory';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import {
  ACTION,
  LocationChangeAction,
  StatsEditDataDeletedAction,
  StatsEditDataFilledAction,
  StatsEditItemNameTypedAction,
  StatsEditLanguageSelectedAction,
  StatsEditNameTypedAction,
  StatsEditRegionSelectedAction,
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

const statsFactory: StatsFactory = StatsFactory.getInstance();
const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();

const STATS_EDIT_PREFIX: string = '/statistics/edit/';

export class StatsEdit {

  public static *init(): IterableIterator<any> {
    yield fork(StatsEdit.findStats);
    yield fork(StatsEdit.nameTyped);
    yield fork(StatsEdit.unitTyped);
    yield fork(StatsEdit.languageSelected);
    yield fork(StatsEdit.regionSelected);
    yield fork(StatsEdit.dataFilled);
    yield fork(StatsEdit.dataDeleted);
    yield fork(StatsEdit.itemNameTyped);
    yield fork(StatsEdit.saveItem);
    yield fork(StatsEdit.rowSelected);
    yield fork(StatsEdit.selectingItemNameTyped);
    yield fork(StatsEdit.startDateDetermined);
    yield fork(StatsEdit.invalidValueInput);
    yield fork(StatsEdit.removeItem);
    yield fork(StatsEdit.rowMoved);
    yield fork(StatsEdit.save);
  }

  private static *findStats(): IterableIterator<any> {
    while (true) {
      const action: LocationChangeAction = yield take(ACTION.LOCATION_CHANGE);
      const path: string = action.payload.location.pathname;

      if (path.startsWith(STATS_EDIT_PREFIX)) {
        const statsID: string = path.replace(STATS_EDIT_PREFIX, '');

        try {
          const response: AJAXResponse<StatsJSON> = yield call(AJAX.get, `/api/stats/${statsID}`);
          const stats: Stats = statsFactory.fromJSON(response.body);

          yield put(updateStats(stats));
          yield put(clearSelectingItem());
        }
        catch (err) {
          yield put(pushToStatsList());
          yield put(appearNotification('error', 'center', 'top', 'STATS_NOT_FOUND'));
        }
      }
    }
  }

  private static *nameTyped(): IterableIterator<any> {
    while (true) {
      const action: StatsEditNameTypedAction = yield take(ACTION.STATS_EDIT_NAME_TYPED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), stats.getTerm(), action.name, stats.getUnit(), stats.getUpdatedAt(), stats.getItems());
      yield put(updateStats(newStats));
    }
  }

  private static *unitTyped(): IterableIterator<any> {
    while (true) {
      const action: StatsEditUnitTypedAction = yield take(ACTION.STATS_EDIT_UNIT_TYPED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), stats.getTerm(), stats.getName(), action.unit, stats.getUpdatedAt(), stats.getItems());
      yield put(updateStats(newStats));
    }
  }

  private static *languageSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsEditLanguageSelectedAction = yield take(ACTION.STATS_EDIT_LANGUAGE_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = statsFactory.from(stats.getStatsID(), action.language, stats.getRegion(), stats.getTerm(), stats.getName(), stats.getUnit(), stats.getUpdatedAt(), stats.getItems());
      yield put(updateStats(newStats));
    }
  }

  private static *regionSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsEditRegionSelectedAction = yield take(ACTION.STATS_EDIT_REGION_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = statsFactory.from(stats.getStatsID(), stats.getLanguage(), action.region, stats.getTerm(), stats.getName(), stats.getUnit(), stats.getUpdatedAt(), stats.getItems());
      yield put(updateStats(newStats));
    }
  }

  private static *dataFilled(): IterableIterator<any> {
    while (true) {
      const action: StatsEditDataFilledAction = yield take(ACTION.STATS_EDIT_DATA_FILLED);
      const state: State = yield select();

      const {
        stats
      } = state;
      const {
        row,
        column,
        value
      } = action;

      const copied: Stats = stats.copy();
      copied.setData(row, column, value);

      yield put(updateStats(copied));
    }
  }

  private static *dataDeleted(): IterableIterator<any> {
    while (true) {
      const action: StatsEditDataDeletedAction = yield take(ACTION.STATS_EDIT_DATA_DELETED);
      const state: State = yield select();

      const {
        stats
      } = state;
      const {
        row,
        column
      } = action;

      const copied: Stats = stats.copy();
      copied.deleteData(row, column);

      yield put(updateStats(copied));
    }
  }

  private static *itemNameTyped(): IterableIterator<any> {
    while (true) {
      const action: StatsEditItemNameTypedAction = yield take(ACTION.STATS_EDIT_ITEM_NAME_TYPED);
      const state: State = yield select();

      const {
        statsItem
      } = state;

      const newStatsItem: StatsItem = statsItemFactory.from(statsItem.getStatsItemID(), action.name, statsItem.getValues());
      yield put(updateStatsItem(newStatsItem));
    }
  }

  private static *saveItem(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.STATS_EDIT_ITEM_SAVE);
      const state: State = yield select();

      const {
        stats,
        statsItem
      } = state;

      const newStats: Stats = statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), stats.getTerm(), stats.getName(), stats.getUnit(), stats.getUpdatedAt(), stats.getItems().add(statsItem), stats.getStartDate());
      yield put(updateStats(newStats));
      yield put(resetStatsItem());
    }
  }

  private static *rowSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsEditRowSelectedAction = yield take(ACTION.STATS_EDIT_ROW_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;
      const {
        row
      } = action;

      const selecting: StatsItem = stats.getItems().get(row);
      yield put(selectItem(selecting, row));
    }
  }

  private static *selectingItemNameTyped(): IterableIterator<any> {
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

      if (selectingItem) {
        const newSelectingItem: StatsItem = statsItemFactory.from(selectingItem.getStatsItemID(), action.name, selectingItem.getValues());
        const copied: Stats = stats.copy();
        copied.replaceItem(newSelectingItem, selectingRow);

        yield put(updateSelectingItem(newSelectingItem));
        yield put(updateStats(copied));
      }
    }
  }

  private static *startDateDetermined(): IterableIterator<any> {
    while (true) {
      const action: StatsEditStartDateDeterminedAction = yield take(ACTION.STATS_EDIT_START_DATE_DETERMINED);
      const state: State = yield select();

      const {
        stats
      } = state;
      const {
        startDate
      } = action;

      const date: moment.Moment = moment(startDate);
      if (date.isValid()) {
        const newStats: Stats = statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), stats.getTerm(), stats.getName(), stats.getUnit(), stats.getUpdatedAt(), stats.getItems(), startDate);
        yield put(updateStats(newStats));
        continue;
      }

      yield put(appearNotification('error', 'center', 'top', 'INVALID_INPUT_DATE'));
    }
  }

  private static *rowMoved(): IterableIterator<any> {
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

  private static *invalidValueInput(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.STATS_EDIT_INVALID_VALUE_INPUT);
      yield put(appearNotification('warn', 'center', 'top', 'INVALID_INPUT_VALUE'));
    }
  }

  private static *removeItem(): IterableIterator<any> {
   while (true) {
     const action: StatsEditRemoveSelectingItemAction = yield take(ACTION.STATS_EDIT_REMOVE_SELECTING_ITEM);
     const state: State = yield select();

     const {
       stats
     } = state;

     const copied: Stats = stats.copy();
     copied.removeItem(action.statsItem);

     yield put(updateStats(copied));
     yield put(clearSelectingItem());
    }
  }

  private static *save(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.STATS_EDIT_SAVE_STATS);
      const state: State = yield select();

      const {
        stats
      } = state;

      yield put(loading());
      try {
        yield call(AJAX.post, '/api/stats', stats.toJSON());
        yield put(loaded());
        yield put(appearNotification('success', 'center', 'top', 'SAVE_SUCCESS'));
      }
      catch (err) {
        yield put(loaded());
        yield put(raiseModal('STATS_SAVE_FAILURE', 'STATS_SAVE_FAILURE_DESCRIPTION'));
      }
    }
  }
}
