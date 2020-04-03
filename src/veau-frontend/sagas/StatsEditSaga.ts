import { SagaIterator } from 'redux-saga';
import { all, call, Effect, fork, put, PutEffect, select, take } from 'redux-saga/effects';
import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { AJAXError } from '../../veau-error/AJAXError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { None } from '../../veau-general/Optional/None';
import { Some } from '../../veau-general/Optional/Some';
import { Try } from '../../veau-general/Try/Try';
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
import { StatsCommand } from '../commands/StatsCommand';
import { LocaleQuery } from '../queries/LocaleQuery';
import { StatsQuery } from '../queries/StatsQuery';
import { State } from '../State';

const statsCommand: StatsCommand = StatsCommand.getInstance();
const statsQuery: StatsQuery = StatsQuery.getInstance();
const localeQuery: LocaleQuery = LocaleQuery.getInstance();

export class StatsEditSaga {

  public static *init(): IterableIterator<unknown> {
    yield fork(StatsEditSaga.findStats);
    yield fork(StatsEditSaga.initializationFailed);
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
    yield fork(StatsEditSaga.invalidDateInput);
    yield fork(StatsEditSaga.invalidValueInput);
    yield fork(StatsEditSaga.removeItem);
    yield fork(StatsEditSaga.rowMoved);
    yield fork(StatsEditSaga.save);
  }

  private static *findStats(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditInitializeAction = yield take(ACTION.STATS_EDIT_INITIALIZE);

      const {
        statsID
      } = action;

      const trial: Try<Stats, NotFoundError | AJAXError> = yield call((): Promise<Try<Stats, NotFoundError | AJAXError>> => {
        return statsQuery.findByStatsID(statsID);
      });

      yield trial.match<Effect>((stats: Stats) => {
        return all([
          put(updateStats(stats)),
          put(clearSelectingItem())
        ]);
      }, (err: NotFoundError | AJAXError) => {
        if (err instanceof NotFoundError) {
          return all([
            put(pushToStatsList()),
            put(appearNotification('error', 'center', 'top', 'STATS_NOT_FOUND'))
          ]);
        }

        return put(pushToStatsList());
      });
    }
  }

  private static *initializationFailed(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_INITIALIZATION_FAILURE);

      yield all([
        put(pushToStatsList()),
        put(appearNotification('error', 'center', 'top', 'MALFORMAT_STATS_ID'))
      ]);
    }
  }

  private static *nameTyped(): SagaIterator<unknown> {
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

  private static *unitTyped(): SagaIterator<unknown> {
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

  private static *iso639Selected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditISO639SelectedAction = yield take(ACTION.STATS_EDIT_ISO639_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const trial: Try<Language, NoSuchElementError | AJAXError> = yield call((): Promise<Try<Language, NoSuchElementError | AJAXError>> => {
        return localeQuery.findByISO639(action.iso639);
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

  private static *iso3166Selected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditISO3166SelectedAction = yield take(ACTION.STATS_EDIT_ISO3166_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const trial: Try<Region, NoSuchElementError | AJAXError> = yield call((): Promise<Try<Region, NoSuchElementError | AJAXError>> => {
        return localeQuery.findByISO3166(action.iso3166);
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

  private static *dataFilled(): SagaIterator<unknown> {
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

  private static *dataDeleted(): SagaIterator<unknown> {
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

  private static *itemNameTyped(): SagaIterator<unknown> {
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

  private static *saveItem(): SagaIterator<unknown> {
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

  private static *rowSelected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsEditRowSelectedAction = yield take(ACTION.STATS_EDIT_ROW_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;
      const {
        row
      } = action;

      const selecting: StatsItem = stats.getRow(row);

      yield put(selectItem(selecting, row));
    }
  }

  private static *selectingItemNameTyped(): SagaIterator<unknown> {
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

      if (selectingItem !== undefined) {
        const newSelectingItem: StatsItem = StatsItem.of(selectingItem.getStatsItemID(), name, selectingItem.getValues());
        const copied: Stats = stats.copy();
        copied.replaceItem(newSelectingItem, selectingRow);

        yield all([
          put(updateSelectingItem(newSelectingItem)),
          put(updateStats(copied))
        ]);
      }
    }
  }

  private static *startDateDetermined(): SagaIterator<unknown> {
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

  private static *invalidDateInput(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_INVALID_DATE_INPUT);

      yield put(appearNotification('error', 'center', 'top', 'INVALID_INPUT_DATE'));
    }
  }

  private static *rowMoved(): SagaIterator<unknown> {
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

  private static *invalidValueInput(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_INVALID_VALUE_INPUT);
      yield put(appearNotification('warn', 'center', 'top', 'INVALID_INPUT_VALUE'));
    }
  }

  private static *removeItem(): SagaIterator<unknown> {
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

  private static *save(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.STATS_EDIT_SAVE_STATS);
      const state: State = yield select();

      const {
        stats
      } = state;

      yield put(loading());

      const trial: Try<void, AJAXError> = yield call((): Promise<Try<void, AJAXError>> => {
        return statsCommand.create(stats);
      });

      yield put(loaded());

      yield trial.match<PutEffect<Action>>(() => {
        return put(appearNotification('success', 'center', 'top', 'SAVE_SUCCESS'));
      }, () => {
        return put(raiseModal('STATS_SAVE_FAILURE', 'STATS_SAVE_FAILURE_DESCRIPTION'));
      });
    }
  }

  private constructor() {
  }
}
