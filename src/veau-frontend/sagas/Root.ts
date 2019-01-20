import { fork } from 'redux-saga/effects';
import { Entrance } from './Entrance';
import {Identity} from './Identity';
import { Language } from './Language';
import { Logout } from './Logout';
import { Redirect } from './Redirect';

export class Root {

  public static *init(): IterableIterator<any> {
    yield fork(Language.init);
    yield fork(Redirect.init);
    yield fork(Entrance.init);
    yield fork(Logout.init);
    yield fork(Identity.init);
  }
}
