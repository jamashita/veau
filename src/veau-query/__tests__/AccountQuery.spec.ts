import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { AccountError } from '../../veau-error/AccountError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { Account } from '../../veau-vo/Account';
import { AccountName } from '../../veau-vo/AccountName';
import { Hash } from '../../veau-vo/Hash';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { AccountQuery } from '../AccountQuery';
import { AccountQuery as AccountMySQLQuery } from '../MySQL/AccountQuery';

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
      const account: Account = Account.of(
        VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de').get(),
        AccountName.of('account'),
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Hash.of('hash')
      );

      const stub: SinonStub = sinon.stub();
      AccountMySQLQuery.prototype.findByAccount = stub;
      stub.resolves(Success.of<Account, NoSuchElementError | AccountError>(account));

      const accountQuery: AccountQuery = container.get<AccountQuery>(TYPE.AccountQuery);
      const name: AccountName = AccountName.of('account');
      const trial: Try<Account, NoSuchElementError | AccountError> = await accountQuery.findByAccount(name);

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get().equals(account)).toEqual(true);
    });

    it('returns Failure by NoSuchElementError', async () => {
      const stub: SinonStub = sinon.stub();
      AccountMySQLQuery.prototype.findByAccount = stub;
      stub.resolves(Failure.of<Account, NoSuchElementError | AccountError>(new NoSuchElementError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const accountQuery: AccountQuery = container.get<AccountQuery>(TYPE.AccountQuery);
      const name: AccountName = AccountName.of('account');
      const trial: Try<Account, NoSuchElementError | AccountError> = await accountQuery.findByAccount(name);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | AccountError) => {
        expect(err).toBeInstanceOf(NoSuchElementError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure by AccountError', async () => {
      const stub: SinonStub = sinon.stub();
      AccountMySQLQuery.prototype.findByAccount = stub;
      stub.resolves(Failure.of<Account, NoSuchElementError | AccountError>(new AccountError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const accountQuery: AccountQuery = container.get<AccountQuery>(TYPE.AccountQuery);
      const name: AccountName = AccountName.of('account');
      const trial: Try<Account, NoSuchElementError | AccountError> = await accountQuery.findByAccount(name);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | AccountError) => {
        expect(err).toBeInstanceOf(AccountError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
