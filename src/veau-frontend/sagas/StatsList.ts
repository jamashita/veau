import { fork, put, select, take } from 'redux-saga/effects';
import {
  ACTION,
  StatsListLanguageSelectedAction,
  StatsListNameTypedAction,
  StatsListRegionSelectedAction, StatsListTermSelectedAction
} from '../../declarations/Action';
import { State } from '../../declarations/State';
import { StatsOverview } from '../../veau-entity/StatsOverview';
import { renewStats } from '../actions/StatsListAction';

export class StatsList {

  public static *init(): IterableIterator<any> {
    yield fork(StatsList.nameTyped);
    yield fork(StatsList.languageSelected);
    yield fork(StatsList.regionSelected);
    yield fork(StatsList.termSelected);
  }

  private static *nameTyped(): IterableIterator<any> {
    while (true) {
      const action: StatsListNameTypedAction = yield take(ACTION.STATS_LIST_NAME_TYPED);
      const state: State = yield select();

      const {
        statsList: {
          newStats
        }
      } = state;

      const newStatsOverview: StatsOverview = new StatsOverview(newStats.getStatsID(), newStats.getISO639(), newStats.getISO3166(), newStats.getTerm(), action.name, newStats.getUpdatedAt());
      yield put(renewStats(newStatsOverview));
    }
  }

  private static *languageSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsListLanguageSelectedAction = yield take(ACTION.STATS_LIST_LANGUAGE_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          newStats
        }
      } = state;

      const newStatsOverview: StatsOverview = new StatsOverview(
        newStats.getStatsID(),
        action.language.getISO639(),
        newStats.getISO3166(),
        newStats.getTerm(),
        newStats.getName(),
        newStats.getUpdatedAt()
      );
      yield put(renewStats(newStatsOverview));
    }
  }

  private static *regionSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsListRegionSelectedAction = yield take(ACTION.STATS_LIST_REGION_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          newStats
        }
      } = state;

      const newStatsOverview: StatsOverview = new StatsOverview(
        newStats.getStatsID(),
        newStats.getISO639(),
        action.region.getISO3166(),
        newStats.getTerm(),
        newStats.getName(),
        newStats.getUpdatedAt()
      );
      yield put(renewStats(newStatsOverview));
    }
  }

  private static *termSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsListTermSelectedAction = yield take(ACTION.STATS_LIST_TERM_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          newStats
        }
      } = state;

      const newStatsOverview: StatsOverview = new StatsOverview(
        newStats.getStatsID(),
        newStats.getISO639(),
        newStats.getISO3166(),
        action.term,
        newStats.getName(),
        newStats.getUpdatedAt()
      );
      yield put(renewStats(newStatsOverview));
    }
  }
}
