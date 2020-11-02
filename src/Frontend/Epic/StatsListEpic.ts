import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, from, merge, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { IRegionQuery } from '../../Query/Interface/IRegionQuery';
import { IStatsListItemQuery } from '../../Query/Interface/IStatsListItemQuery';
import { Language } from '../../VO/Language/Language';
import { Page } from '../../VO/Page/Page';
import { Region } from '../../VO/Region/Region';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import {
  STATS_LIST_INITIALIZE,
  STATS_LIST_ISO3166_SELECTED,
  STATS_LIST_ISO639_SELECTED,
  STATS_LIST_NAME_TYPED,
  STATS_LIST_SAVE_STATS,
  STATS_LIST_TERM_SELECTED,
  STATS_LIST_UNIT_TYPED,
  StatsListISO3166SelectedAction,
  StatsListISO639SelectedAction,
  StatsListNameTypedAction,
  StatsListTermSelectedAction,
  StatsListUnitTypedAction,
  VeauAction
} from '../Action';
import { loaded, loading } from '../ActionCreator/LoadingActionCreator';
import { raiseModal } from '../ActionCreator/ModalActionCreator';
import { nothing } from '../ActionCreator/NothingActionCreator';
import { appearNotification } from '../ActionCreator/NotificationActionCreator';
import { pushToStatsEdit } from '../ActionCreator/RedirectActionCreator';
import {
  closeNewStatsModal,
  resetNewStats,
  resetStatsListItems,
  updateNewStats,
  updateStatsListItems
} from '../ActionCreator/StatsListActionCreator';
import { State } from '../State';

@injectable()
export class StatsListEpic {
  private readonly statsListItemQuery: IStatsListItemQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
    @inject(Type.StatsListItemVaultQuery) statsListItemQuery: IStatsListItemQuery,
    @inject(Type.LanguageVaultQuery) languageQuery: ILanguageQuery,
    @inject(Type.RegionVaultQuery) regionQuery: IRegionQuery,
    @inject(Type.StatsAJAXCommand) statsCommand: IStatsCommand
  ) {
    this.statsListItemQuery = statsListItemQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.statsCommand = statsCommand;
  }

  public init(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return merge<VeauAction>(
      this.findStatsList(action$, state$),
      this.nameTyped(action$, state$),
      this.unitTyped(action$, state$),
      this.iso639Selected(action$, state$),
      this.iso3166Selected(action$, state$),
      this.termSelected(action$, state$),
      this.save(action$, state$)
    );
  }

  public findStatsList(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(STATS_LIST_INITIALIZE),
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        const {
          value: {
            identity
          }
        } = state$;

        return from<Promise<Observable<VeauAction>>>(
          this.statsListItemQuery.findByVeauAccountID(identity.getVeauAccountID(), Page.of(1)).transform<Observable<VeauAction>, Error>((listItems: StatsListItems) => {
            return of<VeauAction>(updateStatsListItems(listItems));
          }, () => {
            return of<VeauAction>(
              resetStatsListItems(),
              appearNotification('error', 'center', 'top', 'STATS_OVERVIEW_NOT_FOUND')
            );
          }).get()
        ).pipe<VeauAction>(
          mergeMap<Observable<VeauAction>, Observable<VeauAction>>((observable: Observable<VeauAction>) => {
            return observable;
          })
        );
      })
    );
  }

  public nameTyped(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsListNameTypedAction, VeauAction>(
      ofType<VeauAction, StatsListNameTypedAction>(STATS_LIST_NAME_TYPED),
      map<StatsListNameTypedAction, VeauAction>((action: StatsListNameTypedAction) => {
        const {
          value: {
            statsList: {
              stats
            }
          }
        } = state$;

        const newStats: Stats = Stats.of(
          StatsOutline.of(
            stats.getStatsID(),
            stats.getLanguage().getLanguageID(),
            stats.getRegion().getRegionID(),
            stats.getTerm().getTermID(),
            action.name,
            stats.getUnit(),
            stats.getUpdatedAt()
          ),
          stats.getLanguage(),
          stats.getRegion(),
          stats.getTerm(),
          stats.getItems(),
          stats.getStartDate()
        );

        return updateNewStats(newStats);
      })
    );
  }

  public unitTyped(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsListUnitTypedAction, VeauAction>(
      ofType<VeauAction, StatsListUnitTypedAction>(STATS_LIST_UNIT_TYPED),
      map<StatsListUnitTypedAction, VeauAction>((action: StatsListUnitTypedAction) => {
        const {
          value: {
            statsList: {
              stats
            }
          }
        } = state$;

        const newStats: Stats = Stats.of(
          StatsOutline.of(
            stats.getStatsID(),
            stats.getLanguage().getLanguageID(),
            stats.getRegion().getRegionID(),
            stats.getTerm().getTermID(),
            stats.getName(),
            action.unit,
            stats.getUpdatedAt()
          ),
          stats.getLanguage(),
          stats.getRegion(),
          stats.getTerm(),
          stats.getItems(),
          stats.getStartDate()
        );

        return updateNewStats(newStats);
      })
    );
  }

  public iso639Selected(
    action$: ActionsObservable<VeauAction>,
    state$: StateObservable<State>
  ): Observable<VeauAction> {
    return action$.pipe<StatsListISO639SelectedAction, VeauAction>(
      ofType<VeauAction, StatsListISO639SelectedAction>(STATS_LIST_ISO639_SELECTED),
      mergeMap<StatsListISO639SelectedAction, Observable<VeauAction>>((action: StatsListISO639SelectedAction) => {
        const {
          value: {
            statsList: {
              stats
            }
          }
        } = state$;

        return from<Promise<Observable<VeauAction>>>(
          this.languageQuery.findByISO639(action.iso639).transform<Observable<VeauAction>, Error>(
            (language: Language) => {
              const newStats: Stats = Stats.of(
                stats.getOutline(),
                language,
                stats.getRegion(),
                stats.getTerm(),
                stats.getItems(),
                stats.getStartDate()
              );

              return of<VeauAction>(updateNewStats(newStats));
            },
            () => {
              return of<VeauAction>(nothing());
            }
          ).get()
        ).pipe(
          mergeMap((observable: Observable<VeauAction>) => {
            return observable;
          })
        );
      })
    );
  }

  public iso3166Selected(
    action$: ActionsObservable<VeauAction>,
    state$: StateObservable<State>
  ): Observable<VeauAction> {
    return action$.pipe<StatsListISO3166SelectedAction, VeauAction>(
      ofType<VeauAction, StatsListISO3166SelectedAction>(STATS_LIST_ISO3166_SELECTED),
      mergeMap<StatsListISO3166SelectedAction, Observable<VeauAction>>((action: StatsListISO3166SelectedAction) => {
        const {
          value: {
            statsList: {
              stats
            }
          }
        } = state$;

        return from<Promise<Observable<VeauAction>>>(
          this.regionQuery.findByISO3166(action.iso3166).transform<Observable<VeauAction>, Error>(
            (region: Region) => {
              const newStats: Stats = Stats.of(
                stats.getOutline(),
                stats.getLanguage(),
                region,
                stats.getTerm(),
                stats.getItems(),
                stats.getStartDate()
              );

              return of<VeauAction>(updateNewStats(newStats));
            },
            () => {
              return of<VeauAction>();
            }
          ).get()
        ).pipe(
          mergeMap((observable: Observable<VeauAction>) => {
            return observable;
          })
        );
      })
    );
  }

  public termSelected(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<StatsListTermSelectedAction, VeauAction>(
      ofType<VeauAction, StatsListTermSelectedAction>(STATS_LIST_TERM_SELECTED),
      map<StatsListTermSelectedAction, VeauAction>((action: StatsListTermSelectedAction) => {
        const {
          value: {
            statsList: {
              stats
            }
          }
        } = state$;

        const newStats: Stats = Stats.of(
          stats.getOutline(),
          stats.getLanguage(),
          stats.getRegion(),
          action.term,
          stats.getItems(),
          stats.getStartDate()
        );

        return updateNewStats(newStats);
      })
    );
  }

  public save(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(STATS_LIST_SAVE_STATS),
      filter<VeauAction>(() => {
        const {
          value: {
            statsList: {
              stats
            }
          }
        } = state$;

        return !stats.isFilled();
      }),
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        const {
          value: {
            identity,
            statsList: {
              stats
            }
          }
        } = state$;

        return concat<VeauAction>(
          of<VeauAction>(closeNewStatsModal(), loading()),
          from<Promise<Observable<VeauAction>>>(
            this.statsCommand.create(stats, identity.getVeauAccountID()).transform<Observable<VeauAction>, Error>(
              () => {
                return of<VeauAction>(pushToStatsEdit(stats.getStatsID()), resetNewStats());
              },
              () => {
                return of<VeauAction>(
                  loaded(),
                  raiseModal('FAILED_TO_SAVE_NEW_STATS', 'FAILED_TO_SAVE_NEW_STATS_DESCRIPTION')
                );
              }
            ).get()
          ),
          of<VeauAction>(loaded())
        );
      })
    );
  }
}
