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
  ACTION,
  Action,
  EntranceAccountNameTypedAction,
  EntrancePasswordTypedAction
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
    return merge(
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

    return action$.pipe(
      ofType<Action, Action>(ACTION.IDENTITY_AUTHENTICATE),
      filter<Action>(() => {
        if (open) {
          return false;
        }
        if (entranceInformation.isAcceptable()) {
          return false;
        }

        return true;
      }),
      mapTo<Action, Action>(loading()),
      mergeMap<Action, Observable<Action>>(() => {
        return from<Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>>(
          this.sessionQuery.findByEntranceInfo(entranceInformation)
        ).pipe(
          mergeMap<Superposition<VeauAccount, VeauAccountError | DataSourceError>, Observable<Action>>((superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError>) => {
            return EMPTY.pipe(
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

    return action$.pipe(
      ofType<Action, EntranceAccountNameTypedAction>(ACTION.ENTRANCE_ACCOUNT_NAME_TYPED),
      map<EntranceAccountNameTypedAction, Action>((action: EntranceAccountNameTypedAction) => {
        const newLogin: EntranceInformation = EntranceInformation.of(
          action.account,
          entranceInformation.getPassword()
        );

        return updateEntranceInformation(newLogin);
      })
    );
  }

  public passwordTyped(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    const {
      value: {
        entranceInformation
      }
    } = state$;

    return action$.pipe(
      ofType<Action, EntrancePasswordTypedAction>(ACTION.ENTRANCE_PASSWORD_TYPED),
      map<EntrancePasswordTypedAction, Action>((action: EntrancePasswordTypedAction) => {
        const newLogin: EntranceInformation = EntranceInformation.of(
          entranceInformation.getAccount(),
          action.password
        );

        return updateEntranceInformation(newLogin);
      })
    );
  }
}
