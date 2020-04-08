import { inject, injectable } from 'inversify';
import { fork } from 'redux-saga/effects';
import { TYPE } from '../../veau-container/Types';
import { EntranceSaga } from './EntranceSaga';
import { IdentitySaga } from './IdentitySaga';
import { LogoutSaga } from './LogoutSaga';
import { RedirectSaga } from './RedirectSaga';
import { StatsEditSaga } from './StatsEditSaga';
import { StatsListSaga } from './StatsListSaga';

@injectable()
export class RootSaga {
  private readonly entranceSaga: EntranceSaga;
  private readonly identitySaga: IdentitySaga;
  private readonly logoutSaga: LogoutSaga;
  private readonly redirectSaga: RedirectSaga;
  private readonly statsEditSaga: StatsEditSaga;
  private readonly statsListSaga: StatsListSaga;

  public constructor(
    @inject(TYPE.EntranceSaga) entranceSaga: EntranceSaga,
    @inject(TYPE.IdentitySaga) identitySaga: IdentitySaga,
    @inject(TYPE.LogoutSaga) logoutSaga: LogoutSaga,
    @inject(TYPE.RedirectSaga) redirectSaga: RedirectSaga,
    @inject(TYPE.StatsEditSaga) statsEditSaga: StatsEditSaga,
    @inject(TYPE.StatsListSaga) statsListSaga: StatsListSaga
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
