import { SagaIterator } from '@redux-saga/types';
import { inject, injectable } from 'inversify';
import { all, call, Effect, fork, put, select, take } from 'redux-saga/effects';
import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { TYPE } from '../../Container/Types';
import { Stats } from '../../Entity/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { IRegionQuery } from '../../Query/Interface/IRegionQuery';
import { IStatsOutlineQuery } from '../../Query/Interface/IStatsOutlineQuery';
import { Language } from '../../VO/Language';
import { Page } from '../../VO/Page';
import { Region } from '../../VO/Region';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccountID';
import {
  ACTION,
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
import { State } from '../State';

@injectable()
export class StatsListSaga {
  private readonly statsOutlineQuery: IStatsOutlineQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
  @inject(TYPE.StatsOutlineAJAXQuery) statsOutlineQuery: IStatsOutlineQuery,
    @inject(TYPE.LanguageVaultQuery) languageQuery: ILanguageQuery,
    @inject(TYPE.RegionVaultQuery) regionQuery: IRegionQuery,
    @inject(TYPE.StatsAJAXCommand) statsCommand: IStatsCommand
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
      yield take(ACTION.STATS_LIST_INITIALIZE);

      const trial: Try<StatsOutlines, StatsOutlinesError | DataSourceError> = yield call((): Promise<Try<StatsOutlines, StatsOutlinesError | DataSourceError>> => {
        return this.statsOutlineQuery.findByVeauAccountID(VeauAccountID.generate(), Page.of(1).get());
      });

      yield trial.match<Effect>((statsOutlines: StatsOutlines) => {
        return put(updateStatsOutlines(statsOutlines));
      }, () => {
        return all([
          put(resetStatsOutlines()),
          put(appearNotification('error', 'center', 'top', 'STATS_OVERVIEW_NOT_FOUND'))
        ]);
      });
    }
  }

  private *nameTyped(): SagaIterator<unknown> {
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
      const action: StatsListISO639SelectedAction = yield take(ACTION.STATS_LIST_ISO639_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          stats
        }
      } = state;

      const trial: Try<Language, NoSuchElementError | DataSourceError> = yield call((): Promise<Try<Language, NoSuchElementError | DataSourceError>> => {
        return this.languageQuery.findByISO639(action.iso639);
      });

      if (trial.isSuccess()) {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          trial.get(),
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
      const action: StatsListISO3166SelectedAction = yield take(ACTION.STATS_LIST_ISO3166_SELECTED);
      const state: State = yield select();

      const {
        statsList: {
          stats
        }
      } = state;

      const trial: Try<Region, NoSuchElementError | DataSourceError> = yield call((): Promise<Try<Region, NoSuchElementError | DataSourceError>> => {
        return this.regionQuery.findByISO3166(action.iso3166);
      });

      if (trial.isSuccess()) {
        const newStats: Stats = Stats.of(
          stats.getStatsID(),
          stats.getLanguage(),
          trial.get(),
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
      const action: StatsListTermSelectedAction = yield take(ACTION.STATS_LIST_TERM_SELECTED);
      const state: State = yield select();

      const {
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

      const trial: Try<void, DataSourceError> = yield call((): Promise<Try<void, DataSourceError>> => {
        return this.statsCommand.create(stats, VeauAccountID.generate());
      });

      yield trial.match<Effect>(() => {
        return all([
          put(loaded()),
          put(pushToStatsEdit(stats.getStatsID())),
          put(resetNewStats())
        ]);
      }, () => {
        return all([
          put(loaded()),
          put(raiseModal('FAILED_TO_SAVE_NEW_STATS', 'FAILED_TO_SAVE_NEW_STATS_DESCRIPTION'))
        ]);
      });
    }
  }
}
