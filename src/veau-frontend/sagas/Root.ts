import {fork} from 'redux-saga/effects';
import {Entrance} from './Entrance';
import {Language} from './Language';
import {Redirect} from './Redirect';

export class Root {

  public static *init(): IterableIterator<any> {
    yield fork(Language.init);
    yield fork(Redirect.init);
    yield fork(Entrance.init);
  }
}
