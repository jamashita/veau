import moment from 'moment';
import { fork, put, select, take } from 'redux-saga/effects';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-entity/Region';
import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsName } from '../../veau-vo/StatsName';
import { StatsUnit } from '../../veau-vo/StatsUnit';
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
import { StatsCommand } from '../commands/StatsCommand';
import { LocaleQuery } from '../queries/LocaleQuery';
import { StatsQuery } from '../queries/StatsQuery';
import { State } from '../State';
import { SagaIterator } from 'redux-saga';

const statsCommand: StatsCommand = StatsCommand.getInstance();
const statsQuery: StatsQuery = StatsQuery.getInstance();
const localeQuery: LocaleQuery = LocaleQuery.getInstance();

const STATS_EDIT_PREFIX: string = '/statistics/edit/';

export class StatsEditSaga {

  public static *init(): IterableIterator<unknown> {
    yield fork(StatsEditSaga.findStats);
    yield fork(StatsEditSaga.nameTyped);
    yield fork(StatsEditSaga.unitTyped);
    yield fork(StatsEditSaga.iso639Selected);
    yield fork(StatsEditSaga.iso3166Selected);
    yield fork(StatsEditSaga.dataFilled);
    yield fork(StatsEditSaga.dataDeleted);
    yield fork(StatsEditSaga.itemNameTyped);
    yield fork(StatsEditSaga.saveItem);
    yield fork(StatsEditSaga.rowSelected);
    yield fork(StatsEditSaga.selectingItemNameTyped);
    yield fork(StatsEditSaga.startDateDetermined);
    yield fork(StatsEditSaga.invalidValueInput);
    yield fork(StatsEditSaga.removeItem);
    yield fork(StatsEditSaga.rowMoved);
    yield fork(StatsEditSaga.save);
  }

  private static *findStats(): SagaIterator<unknown> {
    while (true) {
      const action: LocationChangeAction = yield take(ACTION.LOCATION_CHANGE);
      const path: string = action.payload.location.pathname;

      if (path.startsWith(STATS_EDIT_PREFIX)) {
        const statsID: string = path.replace(STATS_EDIT_PREFIX, '');

        try {
          const stats: Stats = yield statsQuery.findByStatsID(StatsID.of(statsID));

          yield put(updateStats(stats));
          yield put(clearSelectingItem());
        }
        catch (err) {
          if (err instanceof NotFoundError) {
            yield put(pushToStatsList());
            yield put(appearNotification('error', 'center', 'top', 'STATS_NOT_FOUND'));
            continue;
          }

          yield put(pushToStatsList());
        }
      }
    }
  }

  private static *nameTyped(): IterableIterator<unknown> {
    while (true) {
      const action: StatsEditNameTypedAction = yield take(ACTION.STATS_EDIT_NAME_TYPED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = Stats.from(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        StatsName.of(action.name),
        stats.getUnit(),
        stats.getUpdatedAt(),
        stats.getItems()
      );
      yield put(updateStats(newStats));
    }
  }

  private static *unitTyped(): IterableIterator<unknown> {
    while (true) {
      const action: StatsEditUnitTypedAction = yield take(ACTION.STATS_EDIT_UNIT_TYPED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = Stats.from(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        stats.getName(),
        StatsUnit.of(action.unit),
        stats.getUpdatedAt(),
        stats.getItems()
      );
      yield put(updateStats(newStats));
    }
  }

  private static *iso639Selected(): IterableIterator<unknown> {
    while (true) {
      const action: StatsEditISO639SelectedAction = yield take(ACTION.STATS_EDIT_ISO639_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;

      try {
        const language: Language = yield localeQuery.findByISO639(action.iso639);

        const newStats: Stats = Stats.from(
          stats.getStatsID(),
          language,
          stats.getRegion(),
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems()
        );
        yield put(updateStats(newStats));
      }
      catch (err) {
        // NOOP
      }
    }
  }

  private static *iso3166Selected(): IterableIterator<unknown> {
    while (true) {
      const action: StatsEditISO3166SelectedAction = yield take(ACTION.STATS_EDIT_ISO3166_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;

      try {
        const region: Region = yield localeQuery.findByISO3166(action.iso3166);

        const newStats: Stats = Stats.from(
          stats.getStatsID(),
          stats.getLanguage(),
          region,
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems()
        );
        yield put(updateStats(newStats));
      }
      catch (err) {
        // NOOP
      }
    }
  }

  private static *dataFilled(): IterableIterator<unknown> {
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

  private static *dataDeleted(): IterableIterator<unknown> {
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

  private static *itemNameTyped(): IterableIterator<unknown> {
    while (true) {
      const action: StatsEditItemNameTypedAction = yield take(ACTION.STATS_EDIT_ITEM_NAME_TYPED);
      const state: State = yield select();

      const {
        statsItem
      } = state;

      const newStatsItem: StatsItem = StatsItem.from(statsItem.getStatsItemID(), StatsItemName.of(action.name), statsItem.getValues());
      yield put(updateStatsItem(newStatsItem));
    }
  }

  private static *saveItem(): IterableIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_ITEM_SAVE);
      const state: State = yield select();

      const {
        stats,
        statsItem
      } = state;

      const newStats: Stats = Stats.from(
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
      yield put(updateStats(newStats));
      yield put(resetStatsItem());
    }
  }

  private static *rowSelected(): IterableIterator<unknown> {
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

  private static *selectingItemNameTyped(): IterableIterator<unknown> {
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

      if (selectingItem !== undefined) {
        const newSelectingItem: StatsItem = StatsItem.from(selectingItem.getStatsItemID(), StatsItemName.of(action.name), selectingItem.getValues());
        const copied: Stats = stats.copy();
        copied.replaceItem(newSelectingItem, selectingRow);

        yield put(updateSelectingItem(newSelectingItem));
        yield put(updateStats(copied));
      }
    }
  }

  private static *startDateDetermined(): IterableIterator<unknown> {
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
        const newStats: Stats = Stats.from(
          stats.getStatsID(),
          stats.getLanguage(),
          stats.getRegion(),
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems(),
          startDate
        );
        yield put(updateStats(newStats));
        continue;
      }

      yield put(appearNotification('error', 'center', 'top', 'INVALID_INPUT_DATE'));
    }
  }

  private static *rowMoved(): IterableIterator<unknown> {
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

  private static *invalidValueInput(): IterableIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_INVALID_VALUE_INPUT);
      yield put(appearNotification('warn', 'center', 'top', 'INVALID_INPUT_VALUE'));
    }
  }

  private static *removeItem(): IterableIterator<unknown> {
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

  private static *save(): IterableIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_SAVE_STATS);
      const state: State = yield select();

      const {
        stats
      } = state;

      yield put(loading());
      try {
        yield statsCommand.create(stats);

        yield put(loaded());
        yield put(appearNotification('success', 'center', 'top', 'SAVE_SUCCESS'));
      }
      catch (err) {
        yield put(loaded());
        yield put(raiseModal('STATS_SAVE_FAILURE', 'STATS_SAVE_FAILURE_DESCRIPTION'));
      }
    }
  }

  private constructor() {
  }
}
