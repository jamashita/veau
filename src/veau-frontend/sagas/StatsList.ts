import { call, fork, put, select, take } from 'redux-saga/effects';
import * as request from 'superagent';
import {
  ACTION, LocationChangeAction, StatsListISO3166SelectedAction, StatsListISO639SelectedAction,
  StatsListNameTypedAction,
  StatsListTermSelectedAction
} from '../actions/Action';
import { State } from '../State';
import { StatsOverview, StatsOverviewJSON } from '../../veau-entity/StatsOverview';
import { StatsOverviewFactory } from '../../veau-factory/StatsOverviewFactory';
import { AJAX } from '../../veau-general/AJAX';
import { loaded, loading } from '../actions/LoadingAction';
import { raiseModal } from '../actions/ModalAction';
import { appearNotification } from '../actions/NotificationAction';
import { pushToStatsEdit } from '../actions/RedirectAction';
import { updateStatsOverviews } from '../actions/StatsAction';
import { closeNewStatsModal, renewStatsOverview, resetNewStats } from '../actions/StatsListAction';
import { Endpoints } from '../Endpoints';

const statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();

export class StatsList {

  public static *init(): IterableIterator<any> {
    yield fork(StatsList.findStatsList);
    yield fork(StatsList.nameTyped);
    yield fork(StatsList.iso639Selected);
    yield fork(StatsList.iso3166Selected);
    yield fork(StatsList.termSelected);
    yield fork(StatsList.save);
  }

  private static *findStatsList(): IterableIterator<any> {
    while (true) {
      const action: LocationChangeAction = yield take(ACTION.LOCATION_CHANGE);
      const path: string = action.payload.location.pathname;

      if (path === Endpoints.STATS_LIST) {
        try {
          const res: request.Response = yield call(AJAX.get, '/api/stats/overview/1');
          const statsOverviewJSONs: Array<StatsOverviewJSON> = res.body;
          const statsOverviews: Array<StatsOverview> = statsOverviewJSONs.map<StatsOverview>((json: StatsOverviewJSON) => {
            return statsOverviewFactory.fromJSON(json);
          });

          yield put(updateStatsOverviews(statsOverviews));
        }
        catch (err) {
          yield put(updateStatsOverviews([]));
          yield put(appearNotification('error', 'center', 'top', 'STATS_OVERVIEW_NOT_FOUND'));
        }
      }
    }
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

      const latestStatsOverview: StatsOverview = statsOverviewFactory.from(
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

      const latestStatsOverview: StatsOverview = statsOverviewFactory.from(
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

      const latestStatsOverview: StatsOverview = statsOverviewFactory.from(
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

      const latestStatsOverview: StatsOverview = statsOverviewFactory.from(
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

  private static *save(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.STATS_LIST_SAVE_NEW_STATS);

      const state: State = yield select();

      const {
        statsList: {
          newStatsOverview
        }
      } = state;

      if (!newStatsOverview.isFilled()) {
        continue;
      }

      yield put(closeNewStatsModal());
      yield put(loading());
      try {
        yield call(AJAX.post, '/api/stats/overview', newStatsOverview.toJSON());

        yield put(loaded());
        yield put(pushToStatsEdit(newStatsOverview.getStatsID()));
        yield put(resetNewStats());
      }
      catch (err) {
        yield put(loaded());
        yield put(raiseModal('FAILED_TO_SAVE_NEW_STATS', 'FAILED_TO_SAVE_NEW_STATS_DESCRIPTION'));
      }
    }
  }
}
