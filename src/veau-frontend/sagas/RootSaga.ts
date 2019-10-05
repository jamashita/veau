import { fork } from 'redux-saga/effects';
import { EntranceSaga } from './EntranceSaga';
import { IdentitySaga } from './IdentitySaga';
import { LogoutSaga } from './LogoutSaga';
import { RedirectSaga } from './RedirectSaga';
import { StatsEditSaga } from './StatsEditSaga';
import { StatsListSaga } from './StatsListSaga';

export class RootSaga {

  public static *init(): IterableIterator<unknown> {
    yield fork(EntranceSaga.init);
    yield fork(IdentitySaga.init);
    yield fork(LogoutSaga.init);
    yield fork(RedirectSaga.init);
    yield fork(StatsEditSaga.init);
    yield fork(StatsListSaga.init);
  }

  private constructor() {
  }
}
