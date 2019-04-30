import * as moment from 'moment';
import { fork, put, select, take } from 'redux-saga/effects';
import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { StatsFactory } from '../../veau-factory/StatsFactory';
import { StatsItemFactory } from '../../veau-factory/StatsItemFactory';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';
import { StatsID } from '../../veau-vo/StatsID';
import { UUID } from '../../veau-vo/UUID';
import {
  ACTION,
  LocationChangeAction,
  StatsEditDataDeletedAction,
  StatsEditDataFilledAction,
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
import { IStatsCommand } from '../commands/interfaces/IStatsCommand';
import { StatsAJAXCommand } from '../commands/StatsAJAXCommand';
import { IStatsQuery } from '../queries/interfaces/IStatsQuery';
import { StatsAJAXQuery } from '../queries/StatsAJAXQuery';
import { State } from '../State';

export class StatsEditSaga {
  private static instance: StatsEditSaga = new StatsEditSaga();
  private static statsCommand: IStatsCommand = StatsAJAXCommand.getInstance();
  private static statsQuery: IStatsQuery = StatsAJAXQuery.getInstance();
  private static statsFactory: StatsFactory = StatsFactory.getInstance();
  private static statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();
  private static STATS_EDIT_PREFIX: string = '/statistics/edit/';

  public static getInstance(): StatsEditSaga {
    return StatsEditSaga.instance;
  }

  private constructor() {
  }

  public *init(): IterableIterator<any> {
    yield fork(this.findStats);
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
    yield fork(this.invalidValueInput);
    yield fork(this.removeItem);
    yield fork(this.rowMoved);
    yield fork(this.save);
  }

  private *findStats(): IterableIterator<any> {
    while (true) {
      const action: LocationChangeAction = yield take(ACTION.LOCATION_CHANGE);
      const path: string = action.payload.location.pathname;

      if (path.startsWith(StatsEditSaga.STATS_EDIT_PREFIX)) {
        const statsID: string = path.replace(StatsEditSaga.STATS_EDIT_PREFIX, '');

        try {
          const stats: Stats = yield StatsEditSaga.statsQuery.findByStatsID(StatsID.of(UUID.of(statsID)));

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

  private *nameTyped(): IterableIterator<any> {
    while (true) {
      const action: StatsEditNameTypedAction = yield take(ACTION.STATS_EDIT_NAME_TYPED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = StatsEditSaga.statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), stats.getTerm(), action.name, stats.getUnit(), stats.getUpdatedAt(), stats.getItems());
      yield put(updateStats(newStats));
    }
  }

  private *unitTyped(): IterableIterator<any> {
    while (true) {
      const action: StatsEditUnitTypedAction = yield take(ACTION.STATS_EDIT_UNIT_TYPED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = StatsEditSaga.statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), stats.getTerm(), stats.getName(), action.unit, stats.getUpdatedAt(), stats.getItems());
      yield put(updateStats(newStats));
    }
  }

  private *iso639Selected(): IterableIterator<any> {
    while (true) {
      const action: StatsEditISO639SelectedAction = yield take(ACTION.STATS_EDIT_ISO639_SELECTED);
      const state: State = yield select();

      const {
        stats,
        locale: {
          languages
        }
      } = state;
      const {
        iso639
      } = action;

      const found: Language | undefined = languages.find((language: Language) => {
        if (language.getISO639().equals(iso639)) {
          return true;
        }

        return false;
      });

      if (found === undefined) {
        throw new NoSuchElementError(iso639.toString());
      }

      const newStats: Stats = StatsEditSaga.statsFactory.from(stats.getStatsID(), found, stats.getRegion(), stats.getTerm(), stats.getName(), stats.getUnit(), stats.getUpdatedAt(), stats.getItems());
      yield put(updateStats(newStats));
    }
  }

  private *iso3166Selected(): IterableIterator<any> {
    while (true) {
      const action: StatsEditISO3166SelectedAction = yield take(ACTION.STATS_EDIT_ISO3166_SELECTED);
      const state: State = yield select();

      const {
        stats,
        locale: {
          regions
        }
      } = state;
      const {
        iso3166
      } = action;

      const found: Region | undefined = regions.find((region: Region) => {
        if (region.getISO3166().equals(iso3166)) {
          return true;
        }

        return false;
      });

      if (found === undefined) {
        throw new NoSuchElementError(iso3166.toString());
      }

      const newStats: Stats = StatsEditSaga.statsFactory.from(stats.getStatsID(), stats.getLanguage(), found, stats.getTerm(), stats.getName(), stats.getUnit(), stats.getUpdatedAt(), stats.getItems());
      yield put(updateStats(newStats));
    }
  }

  private *dataFilled(): IterableIterator<any> {
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

  private *dataDeleted(): IterableIterator<any> {
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

  private *itemNameTyped(): IterableIterator<any> {
    while (true) {
      const action: StatsEditItemNameTypedAction = yield take(ACTION.STATS_EDIT_ITEM_NAME_TYPED);
      const state: State = yield select();

      const {
        statsItem
      } = state;

      const newStatsItem: StatsItem = StatsEditSaga.statsItemFactory.from(statsItem.getStatsItemID(), action.name, statsItem.getValues());
      yield put(updateStatsItem(newStatsItem));
    }
  }

  private *saveItem(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.STATS_EDIT_ITEM_SAVE);
      const state: State = yield select();

      const {
        stats,
        statsItem
      } = state;

      const newStats: Stats = StatsEditSaga.statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), stats.getTerm(), stats.getName(), stats.getUnit(), stats.getUpdatedAt(), stats.getItems().add(statsItem), stats.getStartDate());
      yield put(updateStats(newStats));
      yield put(resetStatsItem());
    }
  }

  private *rowSelected(): IterableIterator<any> {
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

  private *selectingItemNameTyped(): IterableIterator<any> {
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
        const newSelectingItem: StatsItem = StatsEditSaga.statsItemFactory.from(selectingItem.getStatsItemID(), action.name, selectingItem.getValues());
        const copied: Stats = stats.copy();
        copied.replaceItem(newSelectingItem, selectingRow);

        yield put(updateSelectingItem(newSelectingItem));
        yield put(updateStats(copied));
      }
    }
  }

  private *startDateDetermined(): IterableIterator<any> {
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
        const newStats: Stats = StatsEditSaga.statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), stats.getTerm(), stats.getName(), stats.getUnit(), stats.getUpdatedAt(), stats.getItems(), startDate);
        yield put(updateStats(newStats));
        continue;
      }

      yield put(appearNotification('error', 'center', 'top', 'INVALID_INPUT_DATE'));
    }
  }

  private *rowMoved(): IterableIterator<any> {
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

  private *invalidValueInput(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.STATS_EDIT_INVALID_VALUE_INPUT);
      yield put(appearNotification('warn', 'center', 'top', 'INVALID_INPUT_VALUE'));
    }
  }

  private *removeItem(): IterableIterator<any> {
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

  private *save(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.STATS_EDIT_SAVE_STATS);
      const state: State = yield select();

      const {
        stats
      } = state;

      yield put(loading());
      try {
        yield StatsEditSaga.statsCommand.create(stats);
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
