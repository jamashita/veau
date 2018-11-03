import {fork, put, take} from 'redux-saga/effects';
import {ACTION} from '../../declarations/Action';
import {push} from 'react-router-redux';
import {Endpoints} from '../Endpoints';

export class Redirect {

  public static *init(): IterableIterator<any> {
    yield fork(Redirect.toHome);
  }

  private static *toHome(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.PUSH_TO_HOME);
      yield put(push(Endpoints.HOME));
    }
  }
}
