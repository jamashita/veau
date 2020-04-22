import { inject, injectable } from 'inversify';
import { ofType, StateObservable } from 'redux-observable';
import { EMPTY, from, merge, Observable, of } from 'rxjs';
import { filter, map, mapTo, mergeMap } from 'rxjs/operators';
import { TYPE } from '../../Container/Types';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { ISessionQuery } from '../../Query/Interface/ISessionQuery';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { VeauAccount } from '../../VO/VeauAccount';
import {
  Action,
  ENTRANCE_ACCOUNT_NAME_TYPED,
  ENTRANCE_PASSWORD_TYPED,
  EntranceAccountNameTypedAction,
  EntrancePasswordTypedAction,
  IDENTITY_AUTHENTICATE
} from '../Action/Action';
import { updateEntranceInformation } from '../Action/EntranceAction';
import { identified, identityAuthenticated } from '../Action/IdentityAction';
import { loaded, loading } from '../Action/LoadingAction';
import { raiseModal } from '../Action/ModalAction';
import { pushToStatsList } from '../Action/RedirectAction';
import { State } from '../State';

@injectable()
export class EntranceEpic {
  private readonly sessionQuery: ISessionQuery;

  public constructor(@inject(TYPE.SessionAJAXQuery) sessionQuery: ISessionQuery) {
    this.sessionQuery = sessionQuery;
  }

  public init(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge<Action, Action, Action>(
      this.login(action$, state$),
      this.accountNameTyped(action$, state$),
      this.passwordTyped(action$, state$)
    );
  }

  public login(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    const {
      value: {
        modal: {
          open
        },
        entranceInformation
      }
    } = state$;

    return action$.pipe<Action, Action, Action, Action>(
      ofType<Action, Action>(IDENTITY_AUTHENTICATE),
      filter<Action>(() => {
        if (open) {
          return false;
        }

        return entranceInformation.isAcceptable();
      }),
      mapTo<Action, Action>(loading()),
      mergeMap<Action, Observable<Action>>(() => {
        return from<Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>>(
          this.sessionQuery.findByEntranceInfo(entranceInformation)
        ).pipe<Action>(
          mergeMap<Superposition<VeauAccount, VeauAccountError | DataSourceError>, Observable<Action>>((superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError>) => {
            return EMPTY.pipe<Action, Action>(
              mapTo<never, Action>(loaded()),
              mergeMap<Action, Observable<Action>>(() => {
                return superposition.match<Observable<Action>>((veauAccount: VeauAccount) => {
                  return of<Action>(
                    identityAuthenticated(veauAccount),
                    pushToStatsList(),
                    identified()
                  );
                }, () => {
                  return of<Action>(raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION'));
                });
              })
            );
          })
        );
      })
    );
  }

  public accountNameTyped(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    const {
      value: {
        entranceInformation
      }
    } = state$;

    return action$.pipe<EntranceAccountNameTypedAction, Action>(
      ofType<Action, EntranceAccountNameTypedAction>(ENTRANCE_ACCOUNT_NAME_TYPED),
      map<EntranceAccountNameTypedAction, Action>((action: EntranceAccountNameTypedAction) => {
        const newInfo: EntranceInformation = EntranceInformation.of(
          action.account,
          entranceInformation.getPassword()
        );

        return updateEntranceInformation(newInfo);
      })
    );
  }

  public passwordTyped(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    const {
      value: {
        entranceInformation
      }
    } = state$;

    return action$.pipe<EntrancePasswordTypedAction, Action>(
      ofType<Action, EntrancePasswordTypedAction>(ENTRANCE_PASSWORD_TYPED),
      map<EntrancePasswordTypedAction, Action>((action: EntrancePasswordTypedAction) => {
        const newInfo: EntranceInformation = EntranceInformation.of(
          entranceInformation.getAccount(),
          action.password
        );

        return updateEntranceInformation(newInfo);
      })
    );
  }
}
