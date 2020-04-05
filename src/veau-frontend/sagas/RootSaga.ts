import { fork } from 'redux-saga/effects';
import { EntranceSaga } from './EntranceSaga';
import { IdentitySaga } from './IdentitySaga';
import { LogoutSaga } from './LogoutSaga';
import { RedirectSaga } from './RedirectSaga';
import { StatsEditSaga } from './StatsEditSaga';
import { StatsListSaga } from './StatsListSaga';

export class RootSaga {
  private readonly entranceSaga: EntranceSaga;
  private readonly identitySaga: IdentitySaga;
  private readonly logoutSaga: LogoutSaga;
  private readonly redirectSaga: RedirectSaga;
  private readonly statsEditSaga: StatsEditSaga;
  private readonly statsListSaga: StatsListSaga;

  public constructor(
    entranceSaga: EntranceSaga,
    identitySaga: IdentitySaga,
    logoutSaga: LogoutSaga,
    redirectSaga: RedirectSaga,
    statsEditSaga: StatsEditSaga,
    statsListSaga: StatsListSaga
  ) {
    this.entranceSaga = entranceSaga;
    this.identitySaga = identitySaga;
    this.logoutSaga = logoutSaga;
    this.redirectSaga = redirectSaga;
    this.statsEditSaga = statsEditSaga;
    this.statsListSaga = statsListSaga;
  }

  public *init(): IterableIterator<unknown> {
    yield fork(this.entranceSaga.init);
    yield fork(this.identitySaga.init);
    yield fork(this.logoutSaga.init);
    yield fork(this.redirectSaga.init);
    yield fork(this.statsEditSaga.init);
    yield fork(this.statsListSaga.init);
  }
}
