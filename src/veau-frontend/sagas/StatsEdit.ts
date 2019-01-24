import { fork, take, select, put } from 'redux-saga/effects';
import {
  ACTION,
  StatsEditLanguageSelectedAction,
  StatsEditNameTypedAction,
  StatsEditRegionSelectedAction, StatsEditTermSelectedActoin
} from '../../declarations/Action';
import { State } from '../../declarations/State';
import { Stats } from '../../veau-entity/Stats';
import { StatsFactory } from '../../veau-factory/StatsFactory';
import { updateStats } from '../actions/StatsAction';

const statsFactory: StatsFactory = StatsFactory.getInstance();

export class StatsEdit {

  public static *init(): IterableIterator<any> {
    yield fork(StatsEdit.nameTyped);
    yield fork(StatsEdit.langaugeSelected);
    yield fork(StatsEdit.regionSelected);
    yield fork(StatsEdit.termSelected);
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
}
