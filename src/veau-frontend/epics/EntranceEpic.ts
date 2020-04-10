import { inject, injectable } from 'inversify';
import { ofType, StateObservable } from 'redux-observable';
import { from, merge, Observable, ObservableInput } from 'rxjs';
import { filter, map, mapTo, mergeMap } from 'rxjs/operators';
import { TYPE } from '../../veau-container/Types';
import { AuthenticationFailureError } from '../../veau-error/AuthenticationFailureError';
import { VeauAccountError } from '../../veau-error/VeauAccountError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { ISessionQuery } from '../../veau-query/interfaces/ISessionQuery';
import { VeauAccount } from '../../veau-vo/VeauAccount';
import { ACTION, Action } from '../actions/Action';
import { identified, identityAuthenticated } from '../actions/IdentityAction';
import { loading } from '../actions/LoadingAction';
import { raiseModal } from '../actions/ModalAction';
import { pushToStatsList } from '../actions/RedirectAction';
import { State } from '../State';

@injectable()
export class EntranceEpic {
  private readonly sessionQuery: ISessionQuery;

  public constructor(@inject(TYPE.SessionAJAXQuery) sessionQuery: ISessionQuery) {
    this.sessionQuery = sessionQuery;
  }

  public init(action$: Observable<Action>, stats$: StateObservable<State>): Observable<Action> {
    return merge(
      this.login(action$, stats$)
    );
  }

  public login(action$: Observable<Action>, stats$: StateObservable<State>): Observable<Action> {
    const {
      value: {
        modal: {
          open
        },
        entranceInformation
      }
    } = stats$;

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
      mergeMap<unknown, ObservableInput<Action>>(() => {
        return from<Promise<Try<VeauAccount, VeauAccountError | AuthenticationFailureError | DataSourceError>>>(
          this.sessionQuery.findByEntranceInfo(entranceInformation)
        ).pipe(
          map((tri: Try<VeauAccount, VeauAccountError | AuthenticationFailureError | DataSourceError>) => {
            return tri.match<Action>((veauAccount: VeauAccount) => {
              identityAuthenticated(veauAccount);
              pushToStatsList();
              return identified();
            }, (err: VeauAccountError | AuthenticationFailureError | DataSourceError) => {
              if (err instanceof AuthenticationFailureError) {
                return raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION');
              }

              return raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION');
            });
          })
        );
      })
    );
  }
}
