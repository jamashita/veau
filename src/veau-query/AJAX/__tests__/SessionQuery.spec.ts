import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from 'http-status';
import 'jest';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { AJAXError } from '../../../veau-error/AJAXError';
import { AuthenticationFailureError } from '../../../veau-error/AuthenticationFailureError';
import { UnauthorizedError } from '../../../veau-error/UnauthorizedError';
import { VeauAccountError } from '../../../veau-error/VeauAccountError';
import { AJAX } from '../../../veau-general/AJAX';
import { Try } from '../../../veau-general/Try/Try';
import { AccountName } from '../../../veau-vo/AccountName';
import { EntranceInformation } from '../../../veau-vo/EntranceInformation';
import { Password } from '../../../veau-vo/Password';
import { VeauAccount } from '../../../veau-vo/VeauAccount';
import { SessionQuery } from '../SessionQuery';

describe('SessionQuery', () => {
  describe('find', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: {
          veauAccountID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
          account: 'account',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english language',
            iso639: 'aa'
          },
          region: {
            regionID: 2,
            name: 'region',
            iso3166: 'bb'
          }
        }
      });

      const sessionQuery: SessionQuery = new SessionQuery();
      const trial: Try<VeauAccount, VeauAccountError | UnauthorizedError> = await sessionQuery.find();

      expect(stub.withArgs('/api/identity').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const veauAccount: VeauAccount = trial.get();
      expect(veauAccount.getVeauAccountID().get()).toEqual('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      expect(veauAccount.getAccount().get()).toEqual('account');
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(1);
      expect(veauAccount.getRegion().getRegionID().get()).toEqual(2);
    });

    it('has wrong format veauAccountID', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: {
          veauAccountID: 'malformat uuid',
          account: 'account',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english language',
            iso639: 'aa'
          },
          region: {
            regionID: 2,
            name: 'region',
            iso3166: 'bb'
          }
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const sessionQuery: SessionQuery = new SessionQuery();
      const trial: Try<VeauAccount, VeauAccountError | UnauthorizedError> = await sessionQuery.find();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | UnauthorizedError) => {
        spy2();
        expect(err).toBeInstanceOf(VeauAccountError);
      })

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('doesn\'t return OK', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const sessionQuery: SessionQuery = new SessionQuery();
      const trial: Try<VeauAccount, VeauAccountError | UnauthorizedError> = await sessionQuery.find();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | UnauthorizedError) => {
        spy2();
        expect(err).toBeInstanceOf(UnauthorizedError);
      })

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByEntranceInfo', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: OK,
        body: {
          veauAccountID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
          account: 'account',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english language',
            iso639: 'aa'
          },
          region: {
            regionID: 2,
            name: 'region',
            iso3166: 'bb'
          }
        }
      });

      const info: EntranceInformation = EntranceInformation.of(AccountName.of('account'), Password.of('password'));
      const sessionQuery: SessionQuery = new SessionQuery();
      const trial: Try<VeauAccount, VeauAccountError | AuthenticationFailureError | AJAXError> = await sessionQuery.findByEntranceInfo(info);

      expect(stub.withArgs('/api/auth', {
        account: 'account',
        password: 'password'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const veauAccount: VeauAccount = trial.get();
      expect(veauAccount.getVeauAccountID().get()).toEqual('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      expect(veauAccount.getAccount().get()).toEqual('account');
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(1);
      expect(veauAccount.getRegion().getRegionID().get()).toEqual(2);
    });

    it('has wrong format veauAccountID', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: OK,
        body: {
          veauAccountID: 'malformat uuid',
          account: 'account',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english language',
            iso639: 'aa'
          },
          region: {
            regionID: 2,
            name: 'region',
            iso3166: 'bb'
          }
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const info: EntranceInformation = EntranceInformation.of(AccountName.of('account'), Password.of('password'));
      const sessionQuery: SessionQuery = new SessionQuery();
      const trial: Try<VeauAccount, VeauAccountError | AuthenticationFailureError | AJAXError> = await sessionQuery.findByEntranceInfo(info);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | AuthenticationFailureError | AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(VeauAccountError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns UNAUTHORIZED', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: UNAUTHORIZED,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const info: EntranceInformation = EntranceInformation.of(AccountName.of('account'), Password.of('password'));
      const sessionQuery: SessionQuery = new SessionQuery();
      const trial: Try<VeauAccount, VeauAccountError | AuthenticationFailureError | AJAXError> = await sessionQuery.findByEntranceInfo(info);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | AuthenticationFailureError | AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(AuthenticationFailureError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('doesn\'t return OK', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const info: EntranceInformation = EntranceInformation.of(AccountName.of('account'), Password.of('password'));
      const sessionQuery: SessionQuery = new SessionQuery();
      const trial: Try<VeauAccount, VeauAccountError | AuthenticationFailureError | AJAXError> = await sessionQuery.findByEntranceInfo(info);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | AuthenticationFailureError | AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
