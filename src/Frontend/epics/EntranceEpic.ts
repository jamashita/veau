import { inject, injectable } from 'inversify';
import { ofType, StateObservable } from 'redux-observable';
import { EMPTY, from, merge, Observable } from 'rxjs';
import { filter, map, mapTo, mergeMap } from 'rxjs/operators';
import { TYPE } from '../../Container/Types';
import { AuthenticationFailureError } from '../../Error/AuthenticationFailureError';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { ISessionQuery } from '../../Query/Interface/ISessionQuery';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { VeauAccount } from '../../VO/VeauAccount';
import { ACTION, Action, EntranceAccountNameTypedAction } from '../actions/Action';
import { updateEntranceInformation } from '../actions/EntranceAction';
import { loaded, loading } from '../actions/LoadingAction';
import { raiseModal } from '../actions/ModalAction';
import { pushToStatsList } from '../actions/RedirectAction';
import { State } from '../State';
import { identified, identityAuthenticated } from '../actions/IdentityAction';

@injectable()
export class EntranceEpic {
  private readonly sessionQuery: ISessionQuery;

  public constructor(@inject(TYPE.SessionAJAXQuery) sessionQuery: ISessionQuery) {
    this.sessionQuery = sessionQuery;
  }

  public init(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge(
      this.login(action$, state$),
      this.accountNameTyped(action$, state$)
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
      filter<unknown>(() => {
        if (open) {
          return false;
        }
        if (entranceInformation.isAcceptable()) {
          return false;
        }

        return true;
      }),
      mapTo<unknown, unknown>(loading()),
      mergeMap(() => {
        return from(this.sessionQuery.findByEntranceInfo(entranceInformation)).pipe(
          mergeMap((tri: Try<VeauAccount, VeauAccountError | AuthenticationFailureError | DataSourceError>) => {
            return EMPTY.pipe(
              mapTo(loaded()),
              map(() => {
                return tri.match<Action | Array<Action>>((veauAccount: VeauAccount) => {
                  return [
                    identityAuthenticated(veauAccount),
                    pushToStatsList(),
                    identified()
                  ];
                }, (err: VeauAccountError | AuthenticationFailureError | DataSourceError) => {
                  if (err instanceof AuthenticationFailureError) {
                    return raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION');
                  }

                  return raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION');
                });
              })
              // }),
              // mapTo(loaded())
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
        const newLogin: EntranceInformation = EntranceInformation.of(action.account, entranceInformation.getPassword());

        return updateEntranceInformation(newLogin);
      })
    );
  }
}
