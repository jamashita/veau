import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, from, merge, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Type } from '../../container/Types';
import { AccountName } from '../../domain/vo/Account/AccountName';
import { Identity } from '../../domain/vo/Identity/Identity';
import { ISO639 } from '../../domain/vo/Language/ISO639';
import { Language } from '../../domain/vo/Language/Language';
import { Locale } from '../../domain/vo/Locale/Locale';
import { SystemSupportLanguage } from '../../domain/vo/System/SystemSupportLanguage';
import { VeauAccountID } from '../../domain/vo/VeauAccount/VeauAccountID';
import { IIdentityQuery } from '../../repository/query/interface/IIdentityQuery';
import { ILanguageQuery } from '../../repository/query/interface/ILanguageQuery';
import { ILocaleQuery } from '../../repository/query/interface/ILocaleQuery';
import { LanguageIdentificationService } from '../../service/LanguageIdentificationService';
import { IDENTITY_AUTHENTICATION_FAILED, IDENTITY_INITIALIZE, ON_LOAD, VeauAction } from '../Action';
import {
  identified,
  identityAuthenticated,
  identityAuthenticationFailed
} from '../ActionCreator/IdentityActionCreator';
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
    @inject(Type.IdentityBinQuery) identityQuery: IIdentityQuery,
    @inject(Type.LocaleBinQuery) localeQuery: ILocaleQuery,
    @inject(Type.LanguageBinQuery) languageQuery: ILanguageQuery
  ) {
    this.identityQuery = identityQuery;
    this.localeQuery = localeQuery;
    this.languageQuery = languageQuery;
  }

  public init(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return merge<Array<VeauAction>>(
      this.initIdentity(action$),
      this.noSession(action$, state$),
      this.initialize(action$, state$)
    );
  }

  public initIdentity(action$: ActionsObservable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType(ON_LOAD),
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        return concat<Array<VeauAction>>(
          of<VeauAction>(loading()),
          from<Promise<Observable<VeauAction>>>(
            this.localeQuery.all().transform<Observable<VeauAction>, Error>((locale: Locale) => {
              return of<VeauAction>(defineLocale(locale));
            }, () => {
              return of<VeauAction>(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
            }).get()
          ).pipe<VeauAction>(
            mergeMap<Observable<VeauAction>, Observable<VeauAction>>((observable: Observable<VeauAction>) => {
              return observable;
            })
          ),
          from<Promise<Observable<VeauAction>>>(
            this.identityQuery.find().transform<Observable<VeauAction>, Error>((identity: Identity) => {
              const actions: Array<VeauAction> = [identityAuthenticated(identity), identified()];

              if (location.pathname === Endpoints.ENTRANCE) {
                actions.push(pushToStatsList());
              }

              return of<Array<VeauAction>>(...actions);
            }, () => {
              return of<VeauAction>(identityAuthenticationFailed());
            }).get()
          ).pipe<VeauAction>(
            mergeMap<Observable<VeauAction>, Observable<VeauAction>>((observable: Observable<VeauAction>) => {
              return observable;
            })
          ),
          of<VeauAction>(loaded())
        );
      })
    );
  }

  public initialize(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(IDENTITY_INITIALIZE),
      map<VeauAction, VeauAction>(() => {
        const {
          value: {
            identity
          }
        } = state$;

        const newIdentity: Identity = Identity.of(VeauAccountID.generate(), AccountName.empty(), identity.getLanguage(), identity.getRegion());

        return identityAuthenticated(newIdentity);
      })
    );
  }

  public noSession(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(IDENTITY_AUTHENTICATION_FAILED),
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        const supportLanguage: SystemSupportLanguage = LanguageIdentificationService.toSupportLanguage(navigator.language);
        const iso639: ISO639 = ISO639.of(supportLanguage);

        return from<Promise<Observable<VeauAction>>>(
          this.languageQuery.findByISO639(iso639).transform<Observable<VeauAction>, Error>((language: Language) => {
            const {
              value: {
                identity
              }
            } = state$;

            return of<Array<VeauAction>>(
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
          }, () => {
            return of<VeauAction>(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
          }).get()
        ).pipe<VeauAction>(
          mergeMap<Observable<VeauAction>, Observable<VeauAction>>((observable: Observable<VeauAction>) => {
            return observable;
          })
        );
      })
    );
  }
}
