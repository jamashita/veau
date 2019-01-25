import { call, fork, put, select, take } from 'redux-saga/effects';
import * as request from 'superagent';
import {
  ACTION, LocationChangeAction, StatsEditDataFilledAction, StatsEditItemNameTypedAction, StatsEditItemUnitTypedAction,
  StatsEditLanguageSelectedAction,
  StatsEditNameTypedAction,
  StatsEditRegionSelectedAction, StatsEditTermSelectedActoin
} from '../../declarations/Action';
import { State } from '../../declarations/State';
import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsFactory } from '../../veau-factory/StatsFactory';
import { StatsItemFactory } from '../../veau-factory/StatsItemFactory';
import { AJAX } from '../../veau-general/AJAX';
import { resetStatsItem, updateStats, updateStatsItem } from '../actions/StatsAction';

const statsFactory: StatsFactory = StatsFactory.getInstance();
const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();

const STATS_EDIT_PREFIX: string = '/statistics/edit/';

export class StatsEdit {

  public static *init(): IterableIterator<any> {
    yield fork(StatsEdit.findStats);
    yield fork(StatsEdit.nameTyped);
    yield fork(StatsEdit.langaugeSelected);
    yield fork(StatsEdit.regionSelected);
    yield fork(StatsEdit.termSelected);
    yield fork(StatsEdit.dataFilled);
    yield fork(StatsEdit.itemNameTyped);
    yield fork(StatsEdit.itemUnitTyped);
    yield fork(StatsEdit.saveItem);
  }

  private static *findStats(): IterableIterator<any> {
    while (true) {
      const action: LocationChangeAction = yield take(ACTION.LOCATION_CHANGE);
      const path: string = action.payload.location.pathname;

      if (path.startsWith(STATS_EDIT_PREFIX)) {
        const statsID: string = path.replace(STATS_EDIT_PREFIX, '');
        const res: request.Response = yield call(AJAX.get, `/api/stats/${statsID}`);
        const statsJSON: StatsJSON = res.body;
        const stats: Stats = statsFactory.fromJSON(statsJSON);

        yield put(updateStats(stats));
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

      const newStats: Stats = statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), stats.getTerm(), action.name, stats.getUpdatedAt(), stats.getItems());
      yield put(updateStats(newStats));
    }
  }

  private static *langaugeSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsEditLanguageSelectedAction = yield take(ACTION.STATS_EDIT_LANGUAGE_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = statsFactory.from(stats.getStatsID(), action.language, stats.getRegion(), stats.getTerm(), stats.getName(), stats.getUpdatedAt(), stats.getItems());
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

      const newStats: Stats = statsFactory.from(stats.getStatsID(), stats.getLanguage(), action.region, stats.getTerm(), stats.getName(), stats.getUpdatedAt(), stats.getItems());
      yield put(updateStats(newStats));
    }
  }

  private static *termSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsEditTermSelectedActoin = yield take(ACTION.STATS_EDIT_TERM_SELECTED);
      const state: State = yield select();

      const {
        stats
      } = state;

      const newStats: Stats = statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), action.term, stats.getName(), stats.getUpdatedAt(), stats.getItems());
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

      stats.setData(row, column, value);
      const newStats: Stats = statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), stats.getTerm(), stats.getName(), stats.getUpdatedAt(), stats.getItems());
      yield put(updateStats(newStats));
    }
  }

  private static *itemNameTyped(): IterableIterator<any> {
    while (true) {
      const action: StatsEditItemNameTypedAction = yield take(ACTION.STATS_EDIT_ITEM_NAME_TYPED);
      const state: State = yield select();

      const {
        statsItem
      } = state;

      const newStatsItem: StatsItem = statsItemFactory.from(statsItem.getStatsItemID(), action.name, statsItem.getUnit(), statsItem.getSeq(), statsItem.getValues());
      yield put(updateStatsItem(newStatsItem));
    }
  }

  private static *itemUnitTyped(): IterableIterator<any> {
    while (true) {
      const action: StatsEditItemUnitTypedAction = yield take(ACTION.STATS_EDIT_ITEM_UNIT_TYPED);
      const state: State = yield select();

      const {
        statsItem
      } = state;

      const newStatsItem: StatsItem = statsItemFactory.from(statsItem.getStatsItemID(), statsItem.getName(), action.unit, statsItem.getSeq(), statsItem.getValues());
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

      const newStats: Stats = statsFactory.from(stats.getStatsID(), stats.getLanguage(), stats.getRegion(), stats.getTerm(), stats.getName(), stats.getUpdatedAt(), [
        ...stats.getItems(),
        statsItem
      ]);
      yield put(updateStats(newStats));
      yield put(resetStatsItem());
    }
  }
}
