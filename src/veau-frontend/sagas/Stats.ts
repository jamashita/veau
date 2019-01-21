import { call, fork, put, take } from 'redux-saga/effects';
import * as request from 'superagent';
import { ACTION, LocationChangeAction } from '../../declarations/Action';
import { Stats as StatsEntity, StatsJSON } from '../../veau-entity/Stats';
import { StatsOverview, StatsOverviewJSON } from '../../veau-entity/StatsOverview';
import { StatsFactory } from '../../veau-factory/StatsFactory';
import { StatsOverviewFactory } from '../../veau-factory/StatsOverviewFactory';
import { AJAX } from '../../veau-general/AJAX';
import { updateStats, updateStatsOverviews } from '../actions/StatsOverviewAction';

const statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();
const statsFactory: StatsFactory = StatsFactory.getInstance();
const STATS_EDIT_PREFIX: string = '/statistics/edit/';

export class Stats {

  public static *init(): IterableIterator<any> {
    yield fork(Stats.findStatsList);
    yield fork(Stats.findStats);
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

  private static *findStats(): IterableIterator<any> {
    while (true) {
      const action: LocationChangeAction = yield take(ACTION.LOCATION_CHANGE);
      const path: string = action.payload.location.pathname;

      if (path.startsWith(STATS_EDIT_PREFIX)) {
        const statsID: string = path.replace(STATS_EDIT_PREFIX, '');
        const res: request.Response = yield call(AJAX.get, `/api/stats/${statsID}`);
        const statsJSON: StatsJSON = res.body;
        const stats: StatsEntity = statsFactory.fromJSON(statsJSON);

        yield put(updateStats(stats));
      }
    }
  }
}
