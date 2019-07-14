import { fork, put, select, take } from 'redux-saga/effects';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { Stats } from '../../veau-entity/Stats';
import { StatsOutline } from '../../veau-entity/StatsOutline';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
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
import { resetStatsOutlines, updateStatsOutlines } from '../actions/StatsAction';
import { closeNewStatsModal, resetNewStats, updateNewStats } from '../actions/StatsListAction';
import { StatsCommand } from '../commands/StatsCommand';
import { Endpoints } from '../Endpoints';
import { StatsQuery } from '../queries/StatsQuery';
import { State } from '../State';

const statsCommand: StatsCommand = StatsCommand.getInstance();
const statsQuery: StatsQuery = StatsQuery.getInstance();

export class StatsListSaga {

  public static *init(): IterableIterator<any> {
    yield fork(StatsListSaga.findStatsList);
    yield fork(StatsListSaga.nameTyped);
    yield fork(StatsListSaga.unitTyped);
    yield fork(StatsListSaga.iso639Selected);
    yield fork(StatsListSaga.iso3166Selected);
    yield fork(StatsListSaga.termSelected);
    yield fork(StatsListSaga.save);
  }

  private static *findStatsList(): IterableIterator<any> {
    while (true) {
      const action: LocationChangeAction = yield take(ACTION.LOCATION_CHANGE);
      const path: string = action.payload.location.pathname;

      if (path === Endpoints.STATS_LIST) {
        try {
          const statsOutlines: Array<StatsOutline> = yield statsQuery.findByPage(1);
          yield put(updateStatsOutlines(statsOutlines));
        }
        catch (err) {
          yield put(resetStatsOutlines());
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

      const newStats: Stats = Stats.from(
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

      const newStats: Stats = Stats.from(
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
        locale: {
          languages
        }
      } = state;
      const {
        iso639
      } = action;

      const found: Language | undefined = languages.find((language: Language): boolean => {
        if (language.getISO639().equals(iso639)) {
          return true;
        }

        return false;
      });

      if (found === undefined) {
        throw new NoSuchElementError(iso639.toString());
      }

      const newStats: Stats = Stats.from(
        stats.getStatsID(),
        found,
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
        locale: {
          regions
        }
      } = state;
      const {
        iso3166
      } = action;

      const found: Region | undefined = regions.find((region: Region): boolean => {
        if (region.getISO3166().equals(iso3166)) {
          return true;
        }

        return false;
      });

      if (found === undefined) {
        throw new NoSuchElementError(iso3166.toString());
      }

      const newStats: Stats = Stats.from(
        stats.getStatsID(),
        stats.getLanguage(),
        found,
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

      const newStats: Stats = Stats.from(
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
        yield statsCommand.create(stats);

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

  private constructor() {
  }
}
