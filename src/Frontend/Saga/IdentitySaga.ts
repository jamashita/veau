import { SagaIterator } from '@redux-saga/types';
import { DataSourceError, Superposition } from 'publikum';
import { all, call, Effect, fork, put, select, take } from 'redux-saga/effects';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { UnauthorizedError } from '../../Error/UnauthorizedError';
import { VeauAccountError } from '../../Error/VeauAccountError';
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
import { IDENTITY_INITIALIZE } from '../Action/Action';
import { identified, identityAuthenticated } from '../Action/IdentityAction';
import { loaded, loading } from '../Action/LoadingAction';
import { defineLocale } from '../Action/LocaleAction';
import { raiseModal } from '../Action/ModalAction';
import { pushToEntrance, pushToStatsList } from '../Action/RedirectAction';
import { Endpoints } from '../Endpoints';
import { State } from '../State';

export class IdentitySaga {
  private readonly sessionQuery: ISessionQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly languageQuery: ILanguageQuery;

  public constructor(
    sessionQuery: ISessionQuery,
    localeQuery: ILocaleQuery,
    languageQuery: ILanguageQuery
  ) {
    this.sessionQuery = sessionQuery;
    this.localeQuery = localeQuery;
    this.languageQuery = languageQuery;
  }

  public *init(): IterableIterator<unknown> {
    yield fork(this.initIdentity);
    yield fork(this.initialize);
  }

  private *initIdentity(): SagaIterator<void> {
    yield put(loading());

    const superposition1: Superposition<Locale, DataSourceError> = yield call((): Promise<Superposition<Locale, DataSourceError>> => {
      return this.localeQuery.all();
    });

    yield put(loaded());

    yield superposition1.match<Effect>((locale: Locale) => {
      return put(defineLocale(locale));
    }, () => {
      return put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
    });

    const superposition2: Superposition<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError> = yield call((): Promise<Superposition<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>> => {
      return this.sessionQuery.find();
    });

    if (superposition2.isSuccess()) {
      const effects: Array<Effect> = [
        put(identityAuthenticated(superposition2.get())),
        put(identified())
      ];

      if (location.pathname === Endpoints.ENTRANCE) {
        effects.push(put(pushToStatsList()));
      }

      yield all(effects);
    }

    const supportLanguage: SystemSupportLanguage = LanguageIdentificationService.toSupportLanguage(navigator.language);
    const iso639: ISO639 = ISO639.of(supportLanguage);
    const state: State = yield select();

    const {
      identity
    } = state;

    const superposition3: Superposition<Language, NoSuchElementError | DataSourceError> = yield call((): Promise<Superposition<Language, NoSuchElementError | DataSourceError>> => {
      return this.languageQuery.findByISO639(iso639);
    });

    yield superposition3.match<Effect>((language: Language) => {
      const veauAccount: VeauAccount = VeauAccount.of(identity.getVeauAccountID(), identity.getAccount(), language, identity.getRegion());

      return all([
        put(identityAuthenticated(veauAccount)),
        put(pushToEntrance())
      ]);
    }, () => {
      return put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
    });
  }

  private *initialize(): SagaIterator<unknown> {
    while (true) {
      yield take(IDENTITY_INITIALIZE);
      const state: State = yield select();

      const {
        identity
      } = state;

      const veauAccount: VeauAccount = VeauAccount.of(VeauAccountID.generate(), AccountName.empty(), identity.getLanguage(), identity.getRegion());

      yield put(identityAuthenticated(veauAccount));
    }
  }
}
