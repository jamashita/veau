import { fork, put, select, take } from 'redux-saga/effects';
import {
  ACTION, StatsListISO3166SelectedAction, StatsListISO639SelectedAction,
  StatsListNameTypedAction,
  StatsListTermSelectedAction
} from '../../declarations/Action';
import { State } from '../../declarations/State';
import { StatsOverview } from '../../veau-entity/StatsOverview';
import { renewStatsOverview } from '../actions/StatsListAction';

export class StatsList {

  public static *init(): IterableIterator<any> {
    yield fork(StatsList.nameTyped);
    yield fork(StatsList.iso639Selected);
    yield fork(StatsList.iso3166Selected);
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

  private static *iso639Selected(): IterableIterator<any> {
    while (true) {
      const action: StatsListISO639SelectedAction = yield take(ACTION.STATS_LIST_ISO639_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          newStatsOverview
        }
      } = state;

      const latestStatsOverview: StatsOverview = new StatsOverview(
        newStatsOverview.getStatsID(),
        action.iso639,
        newStatsOverview.getISO3166(),
        newStatsOverview.getTerm(),
        newStatsOverview.getName(),
        newStatsOverview.getUpdatedAt()
      );
      yield put(renewStatsOverview(latestStatsOverview));
    }
  }

  private static *iso3166Selected(): IterableIterator<any> {
    while (true) {
      const action: StatsListISO3166SelectedAction = yield take(ACTION.STAts_LIST_ISO3166_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          newStatsOverview
        }
      } = state;

      const latestStatsOverview: StatsOverview = new StatsOverview(
        newStatsOverview.getStatsID(),
        newStatsOverview.getISO639(),
        action.iso3166,
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
