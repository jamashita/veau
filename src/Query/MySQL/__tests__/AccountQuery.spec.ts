import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import { MockMySQL, MySQLError } from '@jamashita/publikum-mysql';
import { UUID } from '@jamashita/publikum-uuid';
import 'reflect-metadata';

import sinon, { SinonStub } from 'sinon';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { Account, AccountRow } from '../../../VO/Account/Account';
import { AccountError } from '../../../VO/Account/Error/AccountError';
import { MockAccountName } from '../../../VO/Account/Mock/MockAccountName';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { AccountQuery } from '../AccountQuery';

describe('AccountQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const accountQuery1: AccountQuery = kernel.get<AccountQuery>(Type.AccountMySQLQuery);
      const accountQuery2: AccountQuery = kernel.get<AccountQuery>(Type.AccountMySQLQuery);

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
      const schrodinger: Schrodinger<
        Account,
        AccountError | NoSuchElementError | DataSourceError
      > = await accountQuery.findByAccount(accountName).terminate();

      expect(
        stub.withArgs(
          `SELECT
      R1.veau_account_id AS veauAccountID,
      R1.language_id AS languageID,
      R1.region_id AS regionID,
      R1.account AS name,
      R2.hash
      FROM veau_accounts R1
      INNER JOIN veau_account_hashes R2
      USING(veau_account_id)
      WHERE R1.account = :account
      AND R1.active = true;`,
          {
            account: accountName.get()
          }
        ).called
      ).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const account: Account = schrodinger.get();

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

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const schrodinger: Schrodinger<
        Account,
        AccountError | NoSuchElementError | DataSourceError
      > = await accountQuery.findByAccount(name).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
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

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const schrodinger: Schrodinger<
        Account,
        AccountError | NoSuchElementError | DataSourceError
      > = await accountQuery.findByAccount(name).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AccountError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const name: MockAccountName = new MockAccountName();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faield'));

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const schrodinger: Schrodinger<
        Account,
        AccountError | NoSuchElementError | DataSourceError
      > = await accountQuery.findByAccount(name).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
