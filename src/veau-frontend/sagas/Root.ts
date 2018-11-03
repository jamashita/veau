import {Entrance} from './Entrance';
import {fork} from 'redux-saga/effects';
import {Language} from './Language';

export class Root {

  public static *init(): IterableIterator<any> {
    yield fork(Language.init);
    yield fork(Entrance.init);
  }
}
