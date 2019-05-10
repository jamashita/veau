import { fork, put, take } from 'redux-saga/effects';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { ACTION } from '../actions/Action';
import { defineLanguages, defineRegions } from '../actions/LocaleAction';
import { ILocaleQuery } from '../queries/interfaces/ILocaleQuery';
import { LocaleAJAXQuery } from '../queries/LocaleAJAXQuery';

const localeQuery: ILocaleQuery = LocaleAJAXQuery.getInstance();

export class LocaleSaga {

  public static *init(): IterableIterator<any> {
    yield fork(LocaleSaga.fetchLocales);
  }

  private static *fetchLocales(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.IDENTITY_IDENTIFIED);

      const languages: Array<Language> = yield localeQuery.allLanguages();
      const regions: Array<Region> = yield localeQuery.allRegions();

      yield put(defineLanguages(languages));
      yield put(defineRegions(regions));
    }
  }

  private constructor() {
  }
}
