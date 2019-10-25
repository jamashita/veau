import 'jest';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { VeauAccount } from '../../veau-vo/VeauAccount';
import { VeauAccountHash, VeauAccountQuery } from '../VeauAccountQuery';

describe('VeauAccountQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const veauAccountQuery1: VeauAccountQuery = container.get<VeauAccountQuery>(TYPE.VeauAccountQuery);
      const veauAccountQuery2: VeauAccountQuery = container.get<VeauAccountQuery>(TYPE.VeauAccountQuery);

      expect(veauAccountQuery1 instanceof VeauAccountQuery).toEqual(true);
      expect(veauAccountQuery1).toBe(veauAccountQuery2);
    });
  });

  describe('findByAccount', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
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

      const veauAccountQuery: VeauAccountQuery = container.get<VeauAccountQuery>(TYPE.VeauAccountQuery);
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
