import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, merge, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { Type } from '../../Container/Types';
import { IIdentityQuery } from '../../Query/Interface/IIdentityQuery';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { ILocaleQuery } from '../../Query/Interface/ILocaleQuery';
import { LanguageIdentificationService } from '../../Service/LanguageIdentificationService';
import { AccountName } from '../../VO/Account/AccountName';
import { Identity } from '../../VO/Identity/Identity';
import { ISO639 } from '../../VO/Language/ISO639';
import { Language } from '../../VO/Language/Language';
import { Locale } from '../../VO/Locale/Locale';
import { SystemSupportLanguage } from '../../VO/System/SystemSupportLanguage';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { IDENTITY_INITIALIZE, ON_LOAD, VeauAction } from '../Action';
import { identified, identityAuthenticated } from '../ActionCreator/IdentityActionCreator';
import { loaded, loading } from '../ActionCreator/LoadingActionCreator';
import { defineLocale } from '../ActionCreator/LocaleActionCreator';
import { raiseModal } from '../ActionCreator/ModalActionCreator';
import { pushToEntrance, pushToStatsList } from '../ActionCreator/RedirectActionCreator';
import { Endpoints } from '../Endpoints';
import { State } from '../State';

@injectable()
export class IdentityEpic {
  private readonly identityQuery: IIdentityQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly languageQuery: ILanguageQuery;

  public constructor(
    @inject(Type.IdentityVaultQuery) identityQuery: IIdentityQuery,
    @inject(Type.LocaleVaultQuery) localeQuery: ILocaleQuery,
    @inject(Type.LanguageVaultQuery) languageQuery: ILanguageQuery
  ) {
    this.identityQuery = identityQuery;
    this.localeQuery = localeQuery;
    this.languageQuery = languageQuery;
  }

  public init(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return merge<VeauAction>(this.initIdentity(action$, state$), this.initialize(action$, state$));
  }

  public initIdentity(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType(ON_LOAD),
      flatMap<VeauAction, Observable<VeauAction>>(() => {
        return concat<VeauAction>(
          of<VeauAction>(loading()),
          this.localeQuery.all().transform<Observable<VeauAction>, Error>(
            (locale: Locale) => {
              return of<VeauAction>(defineLocale(locale));
            },
            () => {
              return of<VeauAction>(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
            }
          ).get(),
          this.identityQuery.find().transform(
            (identity: Identity) => {
              const actions: Array<VeauAction> = [identityAuthenticated(identity), identified()];

              if (location.pathname === Endpoints.ENTRANCE) {
                actions.push(pushToStatsList());
              }

              return of<VeauAction>(...actions);
            },
            () => {
              return of<VeauAction>();
            }
          ).get(),
          of<VeauAction>(loaded()),
          flatMap<VeauAction, Promise<Observable<VeauAction>>>(() => {
            const supportLanguage: SystemSupportLanguage = LanguageIdentificationService.toSupportLanguage(
              navigator.language
            );
            const iso639: ISO639 = ISO639.of(supportLanguage);

            return this.languageQuery.findByISO639(iso639).transform<Observable<VeauAction>, Error>(
              (language: Language) => {
                // prettier-ignore
                const {
                  value: {
                    identity
                  }
                } = state$;

                return of<VeauAction>(
                  identityAuthenticated(
                    Identity.of(
                      identity.getVeauAccountID(),
                      identity.getAccountName(),
                      language,
                      identity.getRegion()
                    )
                  ),
                  pushToEntrance()
                );
              },
              () => {
                return of<VeauAction>(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
              }
            ).get();
          })
        );
      })
    );
  }

  public initialize(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(IDENTITY_INITIALIZE),
      map<VeauAction, VeauAction>(() => {
        // prettier-ignore
        const {
          value: {
            identity
          }
        } = state$;

        return identityAuthenticated(
          Identity.of(VeauAccountID.generate(), AccountName.empty(), identity.getLanguage(), identity.getRegion())
        );
      })
    );
  }
}
