import { fork, put, select, take } from 'redux-saga/effects';
import {
  ACTION,
  StatsListLanguageSelectedAction,
  StatsListNameTypedAction,
  StatsListRegionSelectedAction, StatsListTermSelectedAction
} from '../../declarations/Action';
import { State } from '../../declarations/State';
import { StatsOverview } from '../../veau-entity/StatsOverview';
import { renewStatsOverview } from '../actions/StatsListAction';

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
          newStatsOverview
        }
      } = state;

      const latestStatsOverview: StatsOverview = new StatsOverview(
        newStatsOverview.getStatsID(),
        newStatsOverview.getISO639(),
        newStatsOverview.getISO3166(),
        newStatsOverview.getTerm(),
        action.name,
        newStatsOverview.getUpdatedAt()
      );
      yield put(renewStatsOverview(latestStatsOverview));
    }
  }

  private static *languageSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsListLanguageSelectedAction = yield take(ACTION.STATS_LIST_LANGUAGE_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          newStatsOverview
        }
      } = state;

      const latestStatsOverview: StatsOverview = new StatsOverview(
        newStatsOverview.getStatsID(),
        action.language.getISO639(),
        newStatsOverview.getISO3166(),
        newStatsOverview.getTerm(),
        newStatsOverview.getName(),
        newStatsOverview.getUpdatedAt()
      );
      yield put(renewStatsOverview(latestStatsOverview));
    }
  }

  private static *regionSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsListRegionSelectedAction = yield take(ACTION.STATS_LIST_REGION_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          newStatsOverview
        }
      } = state;

      const latestStatsOverview: StatsOverview = new StatsOverview(
        newStatsOverview.getStatsID(),
        newStatsOverview.getISO639(),
        action.region.getISO3166(),
        newStatsOverview.getTerm(),
        newStatsOverview.getName(),
        newStatsOverview.getUpdatedAt()
      );
      yield put(renewStatsOverview(latestStatsOverview));
    }
  }

  private static *termSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsListTermSelectedAction = yield take(ACTION.STATS_LIST_TERM_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          newStatsOverview
        }
      } = state;

      const latestStatsOverview: StatsOverview = new StatsOverview(
        newStatsOverview.getStatsID(),
        newStatsOverview.getISO639(),
        newStatsOverview.getISO3166(),
        action.term,
        newStatsOverview.getName(),
        newStatsOverview.getUpdatedAt()
      );
      yield put(renewStatsOverview(latestStatsOverview));
    }
  }
}
