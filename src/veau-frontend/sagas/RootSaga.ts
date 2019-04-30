import { fork } from 'redux-saga/effects';
import { EntranceSaga } from './EntranceSaga';
import { IdentitySaga } from './IdentitySaga';
import { LocaleSaga } from './LocaleSaga';
import { LogoutSaga } from './LogoutSaga';
import { RedirectSaga } from './RedirectSaga';
import { StatsEditSaga } from './StatsEditSaga';
import { StatsListSaga } from './StatsListSaga';

export class RootSaga {
  private static instance: RootSaga = new RootSaga();

  public static getInstance(): RootSaga {
    return RootSaga.instance;
  }

  public *init(): IterableIterator<any> {
    const entranceSaga: EntranceSaga = EntranceSaga.getInstance();
    const identitySaga: IdentitySaga = IdentitySaga.getInstance();
    const localeSaga: LocaleSaga = LocaleSaga.getInstance();
    const logoutSaga: LogoutSaga = LogoutSaga.getInstance();
    const redirectSaga: RedirectSaga = RedirectSaga.getInstance();
    const statsEditSaga: StatsEditSaga = StatsEditSaga.getInstance();
    const statsListSaga: StatsListSaga = StatsListSaga.getInstance();

    yield fork(entranceSaga.init);
    yield fork(identitySaga.init);
    yield fork(localeSaga.init);
    yield fork(logoutSaga.init);
    yield fork(redirectSaga.init);
    yield fork(statsEditSaga.init);
    yield fork(statsListSaga.init);
  }
}
