import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { AccountError } from '../../../veau-error/AccountError';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { MockMySQL } from '../../../veau-general/MySQL/mocks/MockMySQL';
import { MockMySQLError } from '../../../veau-general/MySQL/mocks/MockMySQLError';
import { MySQLError } from '../../../veau-general/MySQL/MySQLError';
import { Try } from '../../../veau-general/Try/Try';
import { Account, AccountRow } from '../../../veau-vo/Account';
import { AccountName } from '../../../veau-vo/AccountName';
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
      const name: AccountName = AccountName.of('account');
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
      const trial: Try<Account, NoSuchElementError | AccountError | DataSourceError> = await accountQuery.findByAccount(name);

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
      expect(trial.isSuccess()).toEqual(true);
      const account: Account = trial.get();
      expect(account.getVeauAccountID().get()).toEqual(rows[0].veauAccountID);
      expect(account.getAccount().get()).toEqual(rows[0].account);
      expect(account.getLanguage().getLanguageID().get()).toEqual(rows[0].languageID);
      expect(account.getLanguage().getName().get()).toEqual(rows[0].languageName);
      expect(account.getLanguage().getEnglishName().get()).toEqual(rows[0].languageEnglishName);
      expect(account.getLanguage().getISO639().get()).toEqual(rows[0].iso639);
      expect(account.getRegion().getRegionID().get()).toEqual(rows[0].regionID);
      expect(account.getRegion().getName().get()).toEqual(rows[0].regionName);
      expect(account.getRegion().getISO3166().get()).toEqual(rows[0].iso3166);
      expect(account.getHash().get()).toEqual(rows[0].hash);
    });

    it('returns Failure because MySQL.execute returns 0 results', async () => {
      const name: AccountName = AccountName.of('account');

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves([
      ]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const trial: Try<Account, NoSuchElementError | AccountError | DataSourceError> = await accountQuery.findByAccount(name);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | AccountError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because veauAccountID is malformat', async () => {
      const name: AccountName = AccountName.of('account');
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
      const trial: Try<Account, NoSuchElementError | AccountError | DataSourceError> = await accountQuery.findByAccount(name);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | AccountError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AccountError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const name: AccountName = AccountName.of('account');

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const trial: Try<Account, NoSuchElementError | AccountError | DataSourceError> = await accountQuery.findByAccount(name);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | AccountError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const name: AccountName = AccountName.of('account');
      const error: Error = new Error();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(error);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      try {
        await accountQuery.findByAccount(name);
        spy1();
      }
      catch (err) {
        spy2();
        expect(err).toBe(error);
      }

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
