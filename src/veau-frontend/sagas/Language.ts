import { fork, put, select } from 'redux-saga/effects';
import { State } from '../../declarations/State';
import { LanguageIdentifier } from '../../veau-general/LanguageIdentifier';
import { newLanguageSelected } from '../actions/IdentityAction';

export class Language {

  public static *init(): IterableIterator<any> {
    yield fork(Language.initLanguage);
  }

  private static *initLanguage(): IterableIterator<any> {
    const state: State = yield select();
    const {
      identity
    } = state;

    if (identity.isDefault()) {
      const newLanguage: string = LanguageIdentifier.toISO639(navigator.language);
      yield put(newLanguageSelected(newLanguage));
    }
  }
}
