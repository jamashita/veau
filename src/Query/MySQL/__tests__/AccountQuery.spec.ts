import { DataSourceError, MockError, MockMySQL, MySQLError, Superposition, UUID } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { AccountError } from '../../../VO/Account/Error/AccountError';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { Account, AccountRow } from '../../../VO/Account/Account';
import { MockAccountName } from '../../../VO/Account/Mock/MockAccountName';
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
          veauAccountID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          name: 'account',
          hash: 'hash'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves(rows);

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const superposition: Superposition<
        Account,
        AccountError | NoSuchElementError | DataSourceError
      > = await accountQuery.findByAccount(accountName);

      expect(
        stub.withArgs(
          `SELECT
      R1.veau_account_id AS veauAccountID,
      R3.language_id AS languageID,
      R4.region_id AS regionID,
      R1.account AS name,
      R2.hash
      FROM veau_accounts R1
      INNER JOIN veau_account_hashes R2
      USING(veau_account_id)
      INNER JOIN languages R3
      USING(language_id)
      INNER JOIN regions R4
      USING(region_id)
      WHERE R1.account = :account
      AND R1.active = true;`,
          {
            account: accountName.get()
          }
        ).called
      ).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const account: Account = superposition.get();
      expect(account.getVeauAccountID().get().get()).toBe(rows[0].veauAccountID);
      expect(account.getLanguageID().get().get()).toBe(rows[0].languageID);
      expect(account.getRegionID().get().get()).toBe(rows[0].regionID);
      expect(account.getAccountName().get()).toBe(rows[0].name);
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
      const superposition: Superposition<
        Account,
        AccountError | NoSuchElementError | DataSourceError
      > = await accountQuery.findByAccount(name);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: AccountError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(NoSuchElementError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because veauAccountID is malformat', async () => {
      const name: MockAccountName = new MockAccountName();
      const rows: Array<AccountRow> = [
        {
          veauAccountID: 'malformat uuid',
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          name: 'account',
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
      const superposition: Superposition<
        Account,
        AccountError | NoSuchElementError | DataSourceError
      > = await accountQuery.findByAccount(name);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: AccountError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AccountError);
        }
      );

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
      const superposition: Superposition<
        Account,
        AccountError | NoSuchElementError | DataSourceError
      > = await accountQuery.findByAccount(name);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: AccountError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

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
