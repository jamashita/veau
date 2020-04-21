import { inject, injectable } from 'inversify';
import { ofType, StateObservable } from 'redux-observable';
import { from, merge, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { TYPE } from '../../Container/Types';
import { Stats } from '../../Entity/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { ILocaleQuery } from '../../Query/Interface/ILocaleQuery';
import { IRegionQuery } from '../../Query/Interface/IRegionQuery';
import { IStatsQuery } from '../../Query/Interface/IStatsQuery';
import { Action, STATS_EDIT_INITIALIZE } from '../Action/Action';
import { appearNotification } from '../Action/NotificationAction';
import { pushToStatsList } from '../Action/RedirectAction';
import { updateStats } from '../Action/StatsAction';
import { clearSelectingItem } from '../Action/StatsEditAction';
import { State } from '../State';

@injectable()
export class StatsEditEpic {
  private readonly statsQuery: IStatsQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
    @inject(TYPE.StatsAJAXQuery) statsQuery: IStatsQuery,
    @inject(TYPE.LocaleVaultQuery) localeQuery: ILocaleQuery,
    @inject(TYPE.LanguageVaultQuery) languageQuery: ILanguageQuery,
    @inject(TYPE.RegionVaultQuery) regionQuery: IRegionQuery,
    @inject(TYPE.StatsAJAXCommand) statsCommand: IStatsCommand
  ) {
    this.statsQuery = statsQuery;
    this.localeQuery = localeQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.statsCommand = statsCommand;
    A;
  }

  public init(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge(
      this.findStats(action$)
    );
  }

  public findStats(action$: Observable<Action>): Observable<Action> {
    return action$.pipe(
      ofType(STATS_EDIT_INITIALIZE),
      mergeMap((a) => {
        // // //
        return from<Promise<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>>>(
          this.statsQuery.findByStatsID(statsID)
        ).pipe<Action>(
          mergeMap<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>, Observable<Action>>((superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>) => {
            return superposition.match<Observable<Action>>((stats: Stats) => {
              return of<Action>(
                updateStats(stats),
                clearSelectingItem()
              );
            }, (err: StatsError | NoSuchElementError | DataSourceError) => {
              if (err instanceof NoSuchElementError) {
                return of<Action>(
                  pushToStatsList(),
                  appearNotification('error', 'center', 'top', 'STATS_NOT_FOUND')
                );
              }

              return of<Action>(pushToStatsList());
            });
          })
        );
      })
    );
  }

  // public findStats(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
  //   const {} = state$;
  //   //
  // }
}
