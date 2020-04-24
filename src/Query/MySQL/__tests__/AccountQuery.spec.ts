import { DataSourceError, MockError, MockMySQL, MySQLError, Superposition } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { AccountError } from '../../../Error/AccountError';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { Account, AccountRow } from '../../../VO/Account';
import { MockAccountName } from '../../../VO/Mock/MockAccountName';
import { AccountQuery } from '../AccountQuery';

describe('AccountQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const accountQuery1: AccountQuery = kernel.get<AccountQuery>(TYPE.AccountMySQLQuery);
      const accountQuery2: AccountQuery = kernel.get<AccountQuery>(TYPE.AccountMySQLQuery);

      expect(accountQuery1).toBeInstanceOf(AccountQuery);
      expect(accountQuery1).toBe(accountQuery2);
    });
  });

  describe('findByAccount', () => {
    it('normal case', async () => {
      const accountName: MockAccountName = new MockAccountName('moloque');
      const rows: Array<AccountRow> = [
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
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves(rows);

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const superposition: Superposition<Account, AccountError | NoSuchElementError | DataSourceError> = await accountQuery.findByAccount(accountName);

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
        account: accountName.get()
      }).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const account: Account = superposition.get();
      expect(account.getVeauAccountID().get().get()).toBe(rows[0].veauAccountID);
      expect(account.getAccount().get()).toBe(rows[0].account);
      expect(account.getLanguage().getLanguageID().get()).toBe(rows[0].languageID);
      expect(account.getLanguage().getName().get()).toBe(rows[0].languageName);
      expect(account.getLanguage().getEnglishName().get()).toBe(rows[0].languageEnglishName);
      expect(account.getLanguage().getISO639().get()).toBe(rows[0].iso639);
      expect(account.getRegion().getRegionID().get()).toBe(rows[0].regionID);
      expect(account.getRegion().getName().get()).toBe(rows[0].regionName);
      expect(account.getRegion().getISO3166().get()).toBe(rows[0].iso3166);
      expect(account.getHash().get()).toBe(rows[0].hash);
    });

    it('returns Dead because MySQL.execute returns 0 results', async () => {
      const name: MockAccountName = new MockAccountName();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves([]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const superposition: Superposition<Account, AccountError | NoSuchElementError | DataSourceError> = await accountQuery.findByAccount(name);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: AccountError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because veauAccountID is malformat', async () => {
      const name: MockAccountName = new MockAccountName();
      const rows: Array<AccountRow> = [
        {
          veauAccountID: 'malformat uuid',
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
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves(rows);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const superposition: Superposition<Account, AccountError | NoSuchElementError | DataSourceError> = await accountQuery.findByAccount(name);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: AccountError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AccountError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const name: MockAccountName = new MockAccountName();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MySQLError('test faield'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const superposition: Superposition<Account, AccountError | NoSuchElementError | DataSourceError> = await accountQuery.findByAccount(name);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: AccountError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('throws Error', async () => {
      const name: MockAccountName = new MockAccountName();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MockError());

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      await expect(accountQuery.findByAccount(name)).rejects.toThrow(MockError);
    });
  });
});
