import { fork } from 'redux-saga/effects';
import { Entrance } from './Entrance';
import { Identity } from './Identity';
import { Locale } from './Locale';
import { Logout } from './Logout';
import { Redirect } from './Redirect';
import { Stats } from './Stats';
import { StatsList } from './StatsList';

export class Root {

  public static *init(): IterableIterator<any> {
    yield fork(Entrance.init);
    yield fork(Identity.init);
    yield fork(Locale.init);
    yield fork(Logout.init);
    yield fork(Redirect.init);
    yield fork(Stats.init);
    yield fork(StatsList.init);
  }
}
