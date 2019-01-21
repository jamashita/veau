import { call, fork, put, take } from 'redux-saga/effects';
import * as request from 'superagent';
import { ACTION, LocationChangeAction } from '../../declarations/Action';
import { StatsOverview, StatsOverviewJSON } from '../../veau-entity/StatsOverview';
import { StatsOverviewFactory } from '../../veau-factory/StatsOverviewFactory';
import { AJAX } from '../../veau-general/AJAX';
import { updateStatsOverviews } from '../actions/StatsOverviewAction';

const statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();

export class Stats {

  public static *init(): IterableIterator<any> {
    yield fork(Stats.findStatsList);
  }

  private static *findStatsList(): IterableIterator<any> {
    while (true) {
      const action: LocationChangeAction = yield take(ACTION.LOCATION_CHANGE);
      const path: string = action.payload.location.pathname;

      if (path === '/statistics/list') {
        const res: request.Response = yield call(AJAX.get, '/api/stats/overview/1');
        const statsOverviewJSONs: Array<StatsOverviewJSON> = res.body;
        const statsOverviews: Array<StatsOverview> = statsOverviewJSONs.map<StatsOverview>((json: StatsOverviewJSON) => {
          return statsOverviewFactory.fromJSON(json);
        });

        yield put(updateStatsOverviews(statsOverviews));
      }
    }
  }
}
