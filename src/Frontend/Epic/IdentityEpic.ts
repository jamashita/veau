import { inject, injectable } from 'inversify';
import { ofType, StateObservable } from 'redux-observable';
import { EMPTY, from, merge, Observable, of } from 'rxjs';
import { mapTo, mergeMap } from 'rxjs/operators';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { UnauthorizedError } from '../../Error/UnauthorizedError';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { ILocaleQuery } from '../../Query/Interface/ILocaleQuery';
import { ISessionQuery } from '../../Query/Interface/ISessionQuery';
import { LanguageIdentificationService } from '../../Service/LanguageIdentificationService';
import { AccountName } from '../../VO/AccountName';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { Locale } from '../../VO/Locale';
import { SystemSupportLanguage } from '../../VO/SystemSupportLanguage';
import { VeauAccount } from '../../VO/VeauAccount';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { ACTION, Action } from '../Action/Action';
import { identified, identityAuthenticated } from '../Action/IdentityAction';
import { loaded, loading } from '../Action/LoadingAction';
import { defineLocale } from '../Action/LocaleAction';
import { raiseModal } from '../Action/ModalAction';
import { pushToEntrance, pushToStatsList } from '../Action/RedirectAction';
import { Endpoints } from '../Endpoints';
import { State } from '../State';

@injectable()
export class IdentityEpic {
  private readonly sessionQuery: ISessionQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly languageQuery: ILanguageQuery;

  public constructor(
    @inject(TYPE.SessionAJAXQuery) sessionQuery: ISessionQuery,
    @inject(TYPE.LocaleVaultQuery) localeQuery: ILocaleQuery,
    @inject(TYPE.LanguageVaultQuery) languageQuery: ILanguageQuery
  ) {
    this.sessionQuery = sessionQuery;
    this.localeQuery = localeQuery;
    this.languageQuery = languageQuery;
  }

  public init(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge(
      this.initIdentity(action$, state$),
      this.initialize(action$, state$)
    );
  }

  public initIdentity(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    const {
      value: {
        identity
      }
    } = state$;

    // TODO RUN ONLY FOR THE FIRST TIME
    return action$.pipe(
      mapTo<Action, Action>(loading()),
      mergeMap<Action, Observable<Action>>(() => {
        return from<Promise<Superposition<Locale, DataSourceError>>>(
          this.localeQuery.all()
        ).pipe(
          mergeMap((superposition1: Superposition<Locale, DataSourceError>) => {
            return EMPTY.pipe(
              mapTo<never, Action>(loaded()),
              mergeMap<Action, Observable<Action>>(() => {
                return superposition1.match<Observable<Action>>((locale: Locale) => {
                  return of<Action>(defineLocale(locale));
                }, () => {
                  return of<Action>(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
                });
              }),
              mergeMap(() => {
                return from<Promise<Superposition<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>>>(
                  this.sessionQuery.find()
                ).pipe(
                  mergeMap((superposition2: Superposition<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>) => {
                    return superposition2.match<Observable<Action>>((veauAccount: VeauAccount) => {
                      const actions: Array<Action> = [
                        identityAuthenticated(veauAccount),
                        identified()
                      ];

                      if (location.pathname === Endpoints.ENTRANCE) {
                        actions.push(pushToStatsList());
                      }

                      return of<Action>(...actions);
                    }, () => {
                      return EMPTY;
                    });
                  }),
                  mergeMap(() => {
                    const supportLanguage: SystemSupportLanguage = LanguageIdentificationService.toSupportLanguage(
                      navigator.language
                    );
                    const iso639: ISO639 = ISO639.of(supportLanguage);

                    return from(
                      this.languageQuery.findByISO639(iso639)
                    ).pipe(
                      mergeMap((superposition3: Superposition<Language, NoSuchElementError | DataSourceError>) => {
                        return superposition3.match<Observable<Action>>((language: Language) => {
                          const veauAccount: VeauAccount = VeauAccount.of(identity.getVeauAccountID(), identity.getAccount(), language, identity.getRegion());

                          return of<Action>(
                            identityAuthenticated(veauAccount),
                            pushToEntrance()
                          );
                        }, () => {
                          return of<Action>(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
                        });
                      })
                    );
                  })
                );
              })
            );
          })
        );
      })
    );
  }

  public initialize(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    const {
      value: {
        identity
      }
    } = state$;

    return action$.pipe(
      ofType<Action, Action>(ACTION.IDENTITY_INITIALIZE),
      mergeMap<Action, Observable<Action>>(() => {
        const veauAccount: VeauAccount = VeauAccount.of(
          VeauAccountID.generate(),
          AccountName.empty(),
          identity.getLanguage(),
          identity.getRegion()
        );

        return of(identityAuthenticated(veauAccount));
      })
    );
  }
}
