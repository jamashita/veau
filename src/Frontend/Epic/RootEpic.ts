import { inject, injectable } from 'inversify';
import { ActionsObservable, Epic, StateObservable } from 'redux-observable';
import { merge, Observable } from 'rxjs';

import { Type } from '../../Container/Types';
import { Action } from '../Action/Action';
import { State } from '../State';
import { EntranceEpic } from './EntranceEpic';
import { IdentityEpic } from './IdentityEpic';
import { LogoutEpic } from './LogoutEpic';
import { RedirectEpic } from './RedirectEpic';
import { StatsEditEpic } from './StatsEditEpic';
import { StatsListEpic } from './StatsListEpic';

@injectable()
export class RootEpic {
  private readonly entranceEpic: EntranceEpic;
  private readonly identityEpic: IdentityEpic;
  private readonly logoutEpic: LogoutEpic;
  private readonly redirectEpic: RedirectEpic;
  private readonly statsEditEpic: StatsEditEpic;
  private readonly statsListEpic: StatsListEpic;

  public constructor(
    @inject(Type.EntranceEpic) entranceEpic: EntranceEpic,
    @inject(Type.IdentityEpic) identityEpic: IdentityEpic,
    @inject(Type.LogoutEpic) logoutEpic: LogoutEpic,
    @inject(Type.RedirectEpic) redirectEpic: RedirectEpic,
    @inject(Type.StatsEditEpic) statsEditEpic: StatsEditEpic,
    @inject(Type.StatsListEpic) statsListEpic: StatsListEpic
  ) {
    this.entranceEpic = entranceEpic;
    this.identityEpic = identityEpic;
    this.logoutEpic = logoutEpic;
    this.redirectEpic = redirectEpic;
    this.statsEditEpic = statsEditEpic;
    this.statsListEpic = statsListEpic;
  }

  public init(): Epic<Action, Action, State> {
    return (action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> => {
      return merge<Action, Action, Action, Action, Action, Action>(
        this.entranceEpic.init(action$, state$),
        this.identityEpic.init(action$, state$),
        this.logoutEpic.init(action$),
        this.redirectEpic.init(action$),
        this.statsEditEpic.init(action$, state$),
        this.statsListEpic.init(action$, state$)
      );
    };
  }
}
