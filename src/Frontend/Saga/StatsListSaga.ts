/* eslint-disable */
// @ts-nocheck
import { DataSourceError, Superposition } from 'publikum';
import { SagaIterator } from 'redux-saga';
import { all, call, Effect, fork, put, select, take } from 'redux-saga/effects';

import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { Stats } from '../../Entity/Stats/Stats';
import { NoSuchElementError } from '../../Query/Error/NoSuchElementError';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { IRegionQuery } from '../../Query/Interface/IRegionQuery';
import { IStatsOutlineQuery } from '../../Query/Interface/IStatsOutlineQuery';
import { Language } from '../../VO/Language/Language';
import { Page } from '../../VO/Page/Page';
import { Region } from '../../VO/Region/Region';
import { StatsOutlinesError } from '../../VO/StatsOutline/Error/StatsOutlinesError';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import {
    STATS_LIST_INITIALIZE, STATS_LIST_ISO3166_SELECTED, STATS_LIST_ISO639_SELECTED,
    STATS_LIST_NAME_TYPED, STATS_LIST_SAVE_NEW_STATS, STATS_LIST_TERM_SELECTED,
    STATS_LIST_UNIT_TYPED, StatsListISO3166SelectedAction, StatsListISO639SelectedAction,
    StatsListNameTypedAction, StatsListTermSelectedAction, StatsListUnitTypedAction
} from '../Action/Action';
import { loaded, loading } from '../Action/LoadingAction';
import { raiseModal } from '../Action/ModalAction';
import { appearNotification } from '../Action/NotificationAction';
import { pushToStatsEdit } from '../Action/RedirectAction';
import { resetStatsListItems, updateStatsListItems } from '../Action/StatsAction';
import { closeNewStatsModal, resetNewStats, updateNewStats } from '../Action/StatsListAction';
import { State } from '../State';

export class StatsListSaga {
  private readonly statsOutlineQuery: IStatsOutlineQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
    statsOutlineQuery: IStatsOutlineQuery,
    languageQuery: ILanguageQuery,
    regionQuery: IRegionQuery,
    statsCommand: IStatsCommand
  ) {
    this.statsOutlineQuery = statsOutlineQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.statsCommand = statsCommand;
  }

  public *init(): IterableIterator<unknown> {
    yield fork(this.findStatsList);
    yield fork(this.nameTyped);
    yield fork(this.unitTyped);
    yield fork(this.iso639Selected);
    yield fork(this.iso3166Selected);
    yield fork(this.termSelected);
    yield fork(this.save);
  }

  private *findStatsList(): SagaIterator<unknown> {
    while (true) {
      yield take(STATS_LIST_INITIALIZE);

      const superposition: Superposition<StatsOutlines, StatsOutlinesError | DataSourceError> = yield call(
        (): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>> => {
          return this.statsOutlineQuery.findByVeauAccountID(VeauAccountID.generate(), Page.of(1).get());
        }
      );

      yield superposition.match<Effect>(
        (statsOutlines: StatsOutlines) => {
          return put(updateStatsListItems(statsOutlines));
        },
        () => {
          return all([
            put(resetStatsListItems()),
            put(appearNotification('error', 'center', 'top', 'STATS_OVERVIEW_NOT_FOUND'))
          ]);
        }
      );
    }
  }

  private *nameTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsListNameTypedAction = yield take(STATS_LIST_NAME_TYPED);
      const state: State = yield select();

      // prettier-ignore
      const {
        // prettier-ignore
        statsList: {
          stats
        }
      } = state;
      // prettier-ignore
      const {
        name
      } = action;

      const newStats: Stats = Stats.of(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        name,
        stats.getUnit(),
        stats.getUpdatedAt(),
        stats.getItems()
      );

      yield put(updateNewStats(newStats));
    }
  }

  private *unitTyped(): SagaIterator<unknown> {
    while (true) {
      const action: StatsListUnitTypedAction = yield take(STATS_LIST_UNIT_TYPED);
      const state: State = yield select();

      // prettier-ignore
      const {
        // prettier-ignore
        statsList: {
          stats
        }
      } = state;
      // prettier-ignore
      const {
        unit
      } = action;

      const newStats: Stats = Stats.of(
        stats.getStatsID(),
        stats.getLanguage(),
        stats.getRegion(),
        stats.getTerm(),
        stats.getName(),
        unit,
        stats.getUpdatedAt(),
        stats.getItems()
      );

      yield put(updateNewStats(newStats));
    }
  }

  private *iso639Selected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsListISO639SelectedAction = yield take(STATS_LIST_ISO639_SELECTED);
      const state: State = yield select();

      // prettier-ignore
      const {
        // prettier-ignore
        statsList: {
          stats
        }
      } = state;

      const superposition: Superposition<Language, NoSuchElementError | DataSourceError> = yield call(
        (): Promise<Superposition<Language, NoSuchElementError | DataSourceError>> => {
          return this.languageQuery.findByISO639(action.iso639);
        }
      );

      if (superposition.isAlive()) {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          superposition.get(),
          stats.getRegion(),
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems()
        );

        return put(updateNewStats(newStats));
      }
    }
  }

  private *iso3166Selected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsListISO3166SelectedAction = yield take(STATS_LIST_ISO3166_SELECTED);
      const state: State = yield select();

      // prettier-ignore
      const {
        // prettier-ignore
        statsList: {
          stats
        }
      } = state;

      const superposition: Superposition<Region, NoSuchElementError | DataSourceError> = yield call(
        (): Promise<Superposition<Region, NoSuchElementError | DataSourceError>> => {
          return this.regionQuery.findByISO3166(action.iso3166);
        }
      );

      if (superposition.isAlive()) {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          stats.getLanguage(),
          superposition.get(),
          stats.getTerm(),
          stats.getName(),
          stats.getUnit(),
          stats.getUpdatedAt(),
          stats.getItems()
        );

        yield put(updateNewStats(newStats));
      }
    }
  }

  private *termSelected(): SagaIterator<unknown> {
    while (true) {
      const action: StatsListTermSelectedAction = yield take(STATS_LIST_TERM_SELECTED);
      const state: State = yield select();

      // prettier-ignore
      const {
        // prettier-ignore
        statsList: {
          stats
        }
      } = state;

      const newStats: Stats = Stats.of(
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

  private *save(): SagaIterator<unknown> {
    while (true) {
      yield take(STATS_LIST_SAVE_NEW_STATS);

      const state: State = yield select();

      // prettier-ignore
      const {
        // prettier-ignore
        statsList: {
          stats
        }
      } = state;

      if (!stats.isFilled()) {
        continue;
      }

      yield all([put(closeNewStatsModal()), put(loading())]);

      const superposition: Superposition<void, DataSourceError> = yield call(
        (): Promise<Superposition<void, DataSourceError>> => {
          return this.statsCommand.create(stats, VeauAccountID.generate());
        }
      );

      yield superposition.match<Effect>(
        () => {
          return all([put(loaded()), put(pushToStatsEdit(stats.getStatsID())), put(resetNewStats())]);
        },
        () => {
          return all([
            put(loaded()),
            put(raiseModal('FAILED_TO_SAVE_NEW_STATS', 'FAILED_TO_SAVE_NEW_STATS_DESCRIPTION'))
          ]);
        }
      );
    }
  }
}
