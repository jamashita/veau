import { inject, injectable } from 'inversify';
import { ActionsObservable, Epic, StateObservable } from 'redux-observable';
import { merge, Observable } from 'rxjs';
import { TYPE } from '../../Container/Types';
import { Action } from '../Action/Action';
import { State } from '../State';
import { EntranceEpic } from './EntranceEpic';
import { IdentityEpic } from './IdentityEpic';
import { LogoutEpic } from './LogoutEpic';
import { RedirectEpic } from './RedirectEpic';

@injectable()
export class RootEpic {
  private readonly entranceEcpic: EntranceEpic;
  private readonly identityEpic: IdentityEpic;
  private readonly logoutEpic: LogoutEpic;
  private readonly redirectEpic: RedirectEpic;

  public constructor(
    // TODO
    @inject(TYPE.AccountMySQLQuery) entranceEpic: EntranceEpic,
    @inject(TYPE.AccountMySQLQuery) identityEpic: IdentityEpic,
    @inject(TYPE.AccountMySQLQuery) logoutEpic: LogoutEpic,
    @inject(TYPE.AccountMySQLQuery) redirectEpic: RedirectEpic
  ) {
    this.entranceEcpic = entranceEpic;
    this.identityEpic = identityEpic;
    this.logoutEpic = logoutEpic;
    this.redirectEpic = redirectEpic;
  }

  public init(): Epic<Action, Action, State> {
    return (action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> => {
      return merge(
        this.entranceEcpic.init(action$, state$),
        this.identityEpic.init(action$, state$),
        this.logoutEpic.init(action$),
        this.redirectEpic.init(action$)
      );
    };
  }
}
