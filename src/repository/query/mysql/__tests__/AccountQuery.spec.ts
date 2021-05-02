import { UUID } from '@jamashita/anden-uuid';
import { MockMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../../../container/Kernel';
import { Type } from '../../../../container/Types';
import { Account, AccountRow } from '../../../../domain/vo/Account/Account';
import { AccountName } from '../../../../domain/vo/Account/AccountName';
import { AccountError } from '../../../../domain/vo/Account/error/AccountError';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { AccountQuery } from '../AccountQuery';

describe('AccountQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const accountQuery1: AccountQuery = kernel.get<AccountQuery>(Type.AccountMySQLQuery);
      const accountQuery2: AccountQuery = kernel.get<AccountQuery>(Type.AccountMySQLQuery);

      expect(accountQuery1).toBeInstanceOf(AccountQuery);
      expect(accountQuery1).toBe(accountQuery2);
    });
  });

  describe('findByAccount', () => {
    it('normal case', async () => {
      expect.assertions(7);

      const accountName: AccountName = AccountName.of('moloque');
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
      const schrodinger: Schrodinger<Account, AccountError | MySQLError | NoSuchElementError> = await accountQuery.findByAccount(accountName).terminate();

      expect(stub.withArgs(
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
      ).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const account: Account = schrodinger.get();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(account.getVeauAccountID().get().get()).toBe(rows[0]!.veauAccountID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(account.getLanguageID().get().get()).toBe(rows[0]!.languageID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(account.getRegionID().get().get()).toBe(rows[0]!.regionID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(account.getAccountName().get()).toBe(rows[0]!.name);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(account.getHash().get()).toBe(rows[0]!.hash);
    });

    it('returns Dead because MySQL.execute returns 0 results', async () => {
      expect.assertions(2);

      const name: AccountName = AccountName.empty();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves([]);

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const schrodinger: Schrodinger<Account, AccountError | MySQLError | NoSuchElementError> = await accountQuery.findByAccount(name).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because veauAccountID is malformat', async () => {
      expect.assertions(2);

      const name: AccountName = AccountName.empty();
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
      const schrodinger: Schrodinger<Account, AccountError | MySQLError | NoSuchElementError> = await accountQuery.findByAccount(name).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AccountError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const name: AccountName = AccountName.empty();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faield'));

      const accountQuery: AccountQuery = new AccountQuery(mysql);
      const schrodinger: Schrodinger<Account, AccountError | MySQLError | NoSuchElementError> = await accountQuery.findByAccount(name).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
