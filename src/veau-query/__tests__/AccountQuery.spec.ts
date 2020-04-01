import 'jest';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { Try } from '../../veau-general/Try/Try';
import { Account } from '../../veau-vo/Account';
import { AccountName } from '../../veau-vo/AccountName';
import { AccountQuery } from '../AccountQuery';

describe('AccountQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const accountQuery1: AccountQuery = container.get<AccountQuery>(TYPE.AccountQuery);
      const accountQuery2: AccountQuery = container.get<AccountQuery>(TYPE.AccountQuery);

      expect(accountQuery1).toBeInstanceOf(AccountQuery);
      expect(accountQuery1).toBe(accountQuery2);
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

      const accountQuery: AccountQuery = container.get<AccountQuery>(TYPE.AccountQuery);
      const name: AccountName = AccountName.of('account');
      const trial: Try<Account, NoSuchElementError> = await accountQuery.findByAccount(name);

      expect(trial.isSuccess()).toEqual(true);

      expect(stub.withArgs(`SELECT
      R1.veau_account_id AS veauAccountID,
      R1.account,
      R3.language_id AS languageID,
      R3.name AS languageName,
      R3.english_name AS languageEnglishName,
      R3.iso639,
      R4.region_id AS regionID,
      R4.name AS regionName,
      R4.iso3166,
      R2.hash
      FROM veau_accounts R1
      INNER JOIN veau_account_hashes R2
      USING(veau_account_id)
      INNER JOIN languages R3
      USING(language_id)
      INNER JOIN regions R4
      USING(region_id)
      WHERE R1.account = :account
      AND R1.active = true;`, {
        account: name.get()
      }).called).toEqual(true);
      trial.complete((account: Account) => {
        expect(account.getVeauAccountID().get()).toEqual('998106de-b2e7-4981-9643-22cd30cd74de');
        expect(account.getAccount().get()).toEqual('account');
        expect(account.getLanguage().getLanguageID().get()).toEqual(1);
        expect(account.getLanguage().getName().get()).toEqual('аҧсуа бызшәа');
        expect(account.getLanguage().getEnglishName().get()).toEqual('Abkhazian');
        expect(account.getLanguage().getISO639().get()).toEqual('ab');
        expect(account.getRegion().getRegionID().get()).toEqual(1);
        expect(account.getRegion().getName().get()).toEqual('Afghanistan');
        expect(account.getRegion().getISO3166().get()).toEqual('AFG');
        expect(account.getHash().get()).toEqual('hash');
      }, (e: NoSuchElementError) => {
        fail(e);
      });
    });

    it('will throw NoSuchElementError because MySQL.query returns 0 results', async () => {
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.resolves([
      ]);

      const accountQuery: AccountQuery = container.get<AccountQuery>(TYPE.AccountQuery);
      const trial: Try<Account, NoSuchElementError> = await accountQuery.findByAccount(name);

      expect(trial.isFailure()).toEqual(trial);

      trial.complete<void>(() => {
        fail();
      }, (e: NoSuchElementError) => {
        expect(e instanceof NoSuchElementError).toEqual(true);
      });
    });
  });
});
