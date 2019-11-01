import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from 'http-status';
import 'jest';
import sinon, { SinonStub } from 'sinon';
import { AJAXError } from '../../../veau-error/AJAXError';
import { AuthenticationFailureError } from '../../../veau-error/AuthenticationFailureError';
import { UnauthorizedError } from '../../../veau-error/UnauthorizedError';
import { AJAX } from '../../../veau-general/AJAX';
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

      const sessionQuery: SessionQuery = SessionQuery.getInstance();
      const veauAccount: VeauAccount = await sessionQuery.find();

      expect(stub.withArgs('/api/identity').called).toEqual(true);
      expect(veauAccount.getVeauAccountID().get()).toEqual('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      expect(veauAccount.getAccount().get()).toEqual('account');
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(1);
      expect(veauAccount.getRegion().getRegionID().get()).toEqual(2);
    });

    it('doesn\'t return OK', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });

      const sessionQuery: SessionQuery = SessionQuery.getInstance();

      await expect(sessionQuery.find()).rejects.toThrow(UnauthorizedError);
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
      const sessionQuery: SessionQuery = SessionQuery.getInstance();
      const veauAccount: VeauAccount = await sessionQuery.findByEntranceInfo(info);

      expect(stub.withArgs('/api/auth', {
        account: 'account',
        password: 'password'
      }).called).toEqual(true);
      expect(veauAccount.getVeauAccountID().get()).toEqual('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      expect(veauAccount.getAccount().get()).toEqual('account');
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(1);
      expect(veauAccount.getRegion().getRegionID().get()).toEqual(2);
    });

    it('returns UNAUTHORIZED', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: UNAUTHORIZED,
        body: {
        }
      });

      const info: EntranceInformation = EntranceInformation.of(AccountName.of('account'), Password.of('password'));
      const sessionQuery: SessionQuery = SessionQuery.getInstance();

      await expect(sessionQuery.findByEntranceInfo(info)).rejects.toThrow(AuthenticationFailureError);
    });

    it('doesn\'t return OK', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });

      const info: EntranceInformation = EntranceInformation.of(AccountName.of('account'), Password.of('password'));
      const sessionQuery: SessionQuery = SessionQuery.getInstance();

      await expect(sessionQuery.findByEntranceInfo(info)).rejects.toThrow(AJAXError);
    });
  });
});
