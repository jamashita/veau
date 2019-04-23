import { call, fork, put, select, take } from 'redux-saga/effects';
import { Stats } from '../../veau-entity/Stats';
import { StatsOverview, StatsOverviewJSON } from '../../veau-entity/StatsOverview';
import { StatsFactory } from '../../veau-factory/StatsFactory';
import { StatsOverviewFactory } from '../../veau-factory/StatsOverviewFactory';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';
import {
  ACTION,
  LocationChangeAction,
  StatsListISO3166SelectedAction,
  StatsListISO639SelectedAction,
  StatsListNameTypedAction,
  StatsListTermSelectedAction,
  StatsListUnitTypedAction
} from '../actions/Action';
import { loaded, loading } from '../actions/LoadingAction';
import { raiseModal } from '../actions/ModalAction';
import { appearNotification } from '../actions/NotificationAction';
import { pushToStatsEdit } from '../actions/RedirectAction';
import { updateStatsOverviews } from '../actions/StatsAction';
import { closeNewStatsModal, resetNewStats, updateNewStats } from '../actions/StatsListAction';
import { IStatsCommand } from '../commands/interfaces/IStatsCommand';
import { StatsAJAXCommand } from '../commands/StatsAJAXCommand';
import { Endpoints } from '../Endpoints';
import { State } from '../State';

export class StatsList {
  private static statsCommand: IStatsCommand = StatsAJAXCommand.getInstance();
  private static statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();
  private static statsFactory: StatsFactory = StatsFactory.getInstance();

  public static *init(): IterableIterator<any> {
    yield fork(StatsList.findStatsList);
    yield fork(StatsList.nameTyped);
    yield fork(StatsList.unitTyped);
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
          const response: AJAXResponse<Array<StatsOverviewJSON>> = yield call(AJAX.get, '/api/stats/overview/1');
          const statsOverviews: Array<StatsOverview> = response.body.map<StatsOverview>((json: StatsOverviewJSON) => {
            return StatsList.statsOverviewFactory.fromJSON(json);
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
          stats
        }
      } = state;

      const newStats: Stats = StatsList.statsFactory.from(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        action.name,
        stats.getUnit(),
        stats.getUpdatedAt(),
        stats.getItems()
      );
      yield put(updateNewStats(newStats));
    }
  }

  private static *unitTyped(): IterableIterator<any> {
    while (true) {
      const action: StatsListUnitTypedAction = yield take(ACTION.STATS_LIST_UNIT_TYPED);
      const state: State = yield select();

      const {
        statsList: {
          stats
        }
      } = state;

      const newStats: Stats = StatsList.statsFactory.from(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        stats.getName(),
        action.unit,
        stats.getUpdatedAt(),
        stats.getItems()
      );
      yield put(updateNewStats(newStats));
    }
  }

  private static *iso639Selected(): IterableIterator<any> {
    while (true) {
      const action: StatsListISO639SelectedAction = yield take(ACTION.STATS_LIST_ISO639_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          stats
        },
        localeQuery
      } = state;

      const language: Language = localeQuery.findByISO639(action.iso639);

      const newStats: Stats = StatsList.statsFactory.from(
        stats.getStatsID(),
        language,
        stats.getRegion(),
        stats.getTerm(),
        stats.getName(),
        stats.getUnit(),
        stats.getUpdatedAt(),
        stats.getItems()
      );
      yield put(updateNewStats(newStats));
    }
  }

  private static *iso3166Selected(): IterableIterator<any> {
    while (true) {
      const action: StatsListISO3166SelectedAction = yield take(ACTION.STATS_LIST_ISO3166_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          stats
        },
        localeQuery
      } = state;

      const region: Region = localeQuery.findByISO3166(action.iso3166);

      const newStats: Stats = StatsList.statsFactory.from(
        stats.getStatsID(),
        stats.getLanguage(),
        region,
        stats.getTerm(),
        stats.getName(),
        stats.getUnit(),
        stats.getUpdatedAt(),
        stats.getItems()
      );
      yield put(updateNewStats(newStats));
    }
  }

  private static *termSelected(): IterableIterator<any> {
    while (true) {
      const action: StatsListTermSelectedAction = yield take(ACTION.STATS_LIST_TERM_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          stats
        }
      } = state;

      const newStats: Stats = StatsList.statsFactory.from(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        action.term,
        stats.getName(),
        stats.getUnit(),
        stats.getUpdatedAt(),
        stats.getItems()
      );
      yield put(updateNewStats(newStats));
    }
  }

  private static *save(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.STATS_LIST_SAVE_NEW_STATS);

      const state: State = yield select();

      const {
        statsList: {
          stats
        }
      } = state;

      if (!stats.isFilled()) {
        continue;
      }

      yield put(closeNewStatsModal());
      yield put(loading());
      try {
        yield call(StatsList.statsCommand.create, stats);

        yield put(loaded());
        yield put(pushToStatsEdit(stats.getStatsID()));
        yield put(resetNewStats());
      }
      catch (err) {
        yield put(loaded());
        yield put(raiseModal('FAILED_TO_SAVE_NEW_STATS', 'FAILED_TO_SAVE_NEW_STATS_DESCRIPTION'));
      }
    }
  }
}
