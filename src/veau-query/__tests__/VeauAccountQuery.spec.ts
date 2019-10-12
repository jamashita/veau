import 'jest';
import sinon, { SinonStub } from 'sinon';
import { veauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { VeauAccount } from '../../veau-vo/VeauAccount';
import { VeauAccountHash, VeauAccountQuery } from '../VeauAccountQuery';

describe('VeauAccountQuery', () => {
  describe('findByAccount', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      veauMySQL.execute = stub;
      stub.resolves([
        {
          veauAccountID: '998106de-b2e7-4981-9643-22cd30cd74de',
          account: 'account',
          languageID: 1,
          languageName: 'аҧсуа бызшәа',
          languageEnglishName: 'Abkhazian',
          iso639: 'ab',
          regionID: 1,
          regionName: 'Afghanistan',
          iso3166: 'AFG',
          hash: 'hash'
        }
      ]);

      const veauAccountQuery: VeauAccountQuery = VeauAccountQuery.getInstance();
      const veauAccountHash: VeauAccountHash = await veauAccountQuery.findByAccount('account');
      const veauAccount: VeauAccount = veauAccountHash.veauAccount;

      expect(veauAccount.getVeauAccountID().get()).toEqual('998106de-b2e7-4981-9643-22cd30cd74de');
      expect(veauAccount.getAccount().get()).toEqual('account');
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(1);
      expect(veauAccount.getLanguage().getName().get()).toEqual('аҧсуа бызшәа');
      expect(veauAccount.getLanguage().getEnglishName().get()).toEqual('Abkhazian');
      expect(veauAccount.getLanguage().getISO639().get()).toEqual('ab');
      expect(veauAccount.getRegion().getRegionID().get()).toEqual(1);
      expect(veauAccount.getRegion().getName().get()).toEqual('Afghanistan');
      expect(veauAccount.getRegion().getISO3166().get()).toEqual('AFG');
      expect(veauAccountHash.hash).toEqual('hash');
    });
  });
});
