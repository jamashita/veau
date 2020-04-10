import { inject, injectable } from 'inversify';
import { ActionsObservable, Epic, StateObservable } from 'redux-observable';
import { merge, Observable } from 'rxjs';
import { TYPE } from '../../veau-container/Types';
import { Action } from '../actions/Action';
import { State } from '../State';
import { EntranceEpic } from './EntranceEpic';

@injectable()
export class RootEpic {
  private entranceEcpic: EntranceEpic;

  public constructor(
    // TODO
    @inject(TYPE.AccountMySQLQuery) entranceEpic: EntranceEpic
  ) {
    this.entranceEcpic = entranceEpic;
  }

  public init(): Epic<Action, Action, State> {
    return (action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> => {
      return merge(
        this.entranceEcpic.init(action$, state$)
      );
    };
  }
}
