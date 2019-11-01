import { SagaIterator } from '@redux-saga/types';
import { all, call, fork, put, select, take } from 'redux-saga/effects';
import { Stats } from '../../veau-entity/Stats';
import { empty } from '../../veau-general/Optional/Empty';
import { AsOf } from '../../veau-vo/AsOf';
import { Language } from '../../veau-vo/Language';
import { Page } from '../../veau-vo/Page';
import { Region } from '../../veau-vo/Region';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';
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
import { LocaleQuery } from '../queries/LocaleQuery';
import { StatsQuery } from '../queries/StatsQuery';
import { State } from '../State';

const statsCommand: StatsCommand = StatsCommand.getInstance();
const statsQuery: StatsQuery = StatsQuery.getInstance();
const localeQuery: LocaleQuery = LocaleQuery.getInstance();

export class StatsListSaga {

  public static *init(): IterableIterator<unknown> {
    yield fork(StatsListSaga.findStatsList);
    yield fork(StatsListSaga.nameTyped);
    yield fork(StatsListSaga.unitTyped);
    yield fork(StatsListSaga.iso639Selected);
    yield fork(StatsListSaga.iso3166Selected);
    yield fork(StatsListSaga.termSelected);
    yield fork(StatsListSaga.save);
  }

  private static *findStatsList(): SagaIterator<unknown> {
    while (true) {
      const action: LocationChangeAction = yield take(ACTION.LOCATION_CHANGE);
      const path: string = action.payload.location.pathname;

      if (path === Endpoints.STATS_LIST) {
        try {
          const statsOutlines: StatsOutlines = yield call((): Promise<StatsOutlines> => {
            return statsQuery.findByPage(Page.of(1));
          });
          yield put(updateStatsOutlines(statsOutlines));
        }
        catch (err) {
          yield all([
            put(resetStatsOutlines()),
            put(appearNotification('error', 'center', 'top', 'STATS_OVERVIEW_NOT_FOUND'))
          ]);
        }
      }
    }
  }

  private static *nameTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsListNameTypedAction = yield take(ACTION.STATS_LIST_NAME_TYPED);
      const state: State = yield select();

      const {
        statsList: {
          stats
        }
      } = state;
      const {
        name
      } = action;

      const newStats: Stats = Stats.from(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        name,
        stats.getUnit(),
        stats.getUpdatedAt(),
        stats.getItems(),
        empty<AsOf>()
      );

      yield put(updateNewStats(newStats));
    }
  }

  private static *unitTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsListUnitTypedAction = yield take(ACTION.STATS_LIST_UNIT_TYPED);
      const state: State = yield select();

      const {
        statsList: {
          stats
        }
      } = state;
      const {
        unit
      } = action;

      const newStats: Stats = Stats.from(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        stats.getName(),
        unit,
        stats.getUpdatedAt(),
        stats.getItems(),
        empty<AsOf>()
      );

      yield put(updateNewStats(newStats));
    }
  }

  private static *iso639Selected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsListISO639SelectedAction = yield take(ACTION.STATS_LIST_ISO639_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          stats
        }
      } = state;

      try {
        const language: Language = yield call((): Promise<Language> => {
          return localeQuery.findByISO639(action.iso639);
        });

        const newStats: Stats = Stats.from(
          stats.getStatsID(),
          language,
          stats.getRegion(),
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems(),
          empty<AsOf>()
        );

        yield put(updateNewStats(newStats));
      }
      catch (err) {
        // NOOP
      }
    }
  }

  private static *iso3166Selected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsListISO3166SelectedAction = yield take(ACTION.STATS_LIST_ISO3166_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          stats
        }
      } = state;

      try {
        const region: Region = yield call((): Promise<Region> => {
          return localeQuery.findByISO3166(action.iso3166);
        });

        const newStats: Stats = Stats.from(
          stats.getStatsID(),
          stats.getLanguage(),
          region,
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems(),
          empty<AsOf>()
        );

        yield put(updateNewStats(newStats));
      }
      catch (err) {
        // NOOP
      }
    }
  }

  private static *termSelected(): SagaIterator<unknown> {
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
        stats.getItems(),
        empty<AsOf>()
      );

      yield put(updateNewStats(newStats));
    }
  }

  private static *save(): SagaIterator<unknown> {
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

      yield all([
        put(closeNewStatsModal()),
        put(loading())
      ]);

      try {
        yield call((): Promise<unknown> => {
          return statsCommand.create(stats);
        });

        yield all([
          put(loaded()),
          put(pushToStatsEdit(stats.getStatsID())),
          put(resetNewStats())
        ]);
      }
      catch (err) {
        yield all([
          put(loaded()),
          put(raiseModal('FAILED_TO_SAVE_NEW_STATS', 'FAILED_TO_SAVE_NEW_STATS_DESCRIPTION'))
        ]);
      }
    }
  }

  private constructor() {
  }
}
