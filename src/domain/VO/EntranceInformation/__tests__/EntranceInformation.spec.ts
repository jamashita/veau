import { AccountName } from '../../Account/AccountName';
import { EntranceInformation } from '../EntranceInformation';
import { MockPassword } from '../Mock/MockPassword';
import { Password } from '../Password';

describe('EntranceInformation', () => {
  describe('empty', () => {
    it('s account and password must also be empty', () => {
      expect.assertions(2);

      const entranceInformation: EntranceInformation = EntranceInformation.empty();

      expect(entranceInformation.getAccount().isEmpty()).toBe(true);
      expect(entranceInformation.getPassword().isEmpty()).toBe(true);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(EntranceInformation.empty()).toBe(EntranceInformation.empty());
    });
  });

  describe('of', () => {
    it('returns EntranceInformation.empty() when AccountName and Password is blank', () => {
      expect.assertions(1);

      const entranceInformation: EntranceInformation = EntranceInformation.of(AccountName.empty(), Password.empty());

      expect(entranceInformation).toBe(EntranceInformation.empty());
    });

    it('normal case', () => {
      expect.assertions(2);

      const name: string = 'name';
      const password: string = 'password';
      const entranceInformation: EntranceInformation = EntranceInformation.of(
        AccountName.of(name),
        Password.of(password)
      );

      expect(entranceInformation.getAccount().get()).toBe(name);
      expect(entranceInformation.getPassword().get()).toBe(password);
    });
  });

  describe('isAcceptable', () => {
    it('returns false if the both are not filled', () => {
      expect.assertions(1);

      const entranceInformation: EntranceInformation = EntranceInformation.of(AccountName.empty(), Password.empty());

      expect(entranceInformation.isAcceptable()).toBe(false);
    });

    it('account is empty, then user is not able to login', () => {
      expect.assertions(1);

      const entranceInformation: EntranceInformation = EntranceInformation.of(
        AccountName.empty(),
        new MockPassword('password')
      );

      expect(entranceInformation.isAcceptable()).toBe(false);
    });

    it('password is empty, then user is not able to login', () => {
      expect.assertions(1);

      const entranceInformation: EntranceInformation = EntranceInformation.of(
        AccountName.of('name'),
        Password.empty()
      );

      expect(entranceInformation.isAcceptable()).toBe(false);
    });

    it('account and password are filled then user is able to attempt login', () => {
      expect.assertions(1);

      const entranceInformation: EntranceInformation = EntranceInformation.of(
        AccountName.of('name'),
        new MockPassword('password')
      );

      expect(entranceInformation.isAcceptable()).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const information: EntranceInformation = EntranceInformation.empty();

      expect(information.equals(null)).toBe(false);
      expect(information.equals(undefined)).toBe(false);
      expect(information.equals('')).toBe(false);
      expect(information.equals('123')).toBe(false);
      expect(information.equals('abcd')).toBe(false);
      expect(information.equals(123)).toBe(false);
      expect(information.equals(0)).toBe(false);
      expect(information.equals(-12)).toBe(false);
      expect(information.equals(0.3)).toBe(false);
      expect(information.equals(false)).toBe(false);
      expect(information.equals(true)).toBe(false);
      expect(information.equals(Symbol('p'))).toBe(false);
      expect(information.equals(20n)).toBe(false);
      expect(information.equals({})).toBe(false);
      expect(information.equals([])).toBe(false);
      expect(information.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the all properties are the same', () => {
      expect.assertions(5);

      const entranceInformation1: EntranceInformation = EntranceInformation.of(
        AccountName.of('name1'),
        new MockPassword('password1')
      );
      const entranceInformation2: EntranceInformation = EntranceInformation.of(
        AccountName.of('name2'),
        new MockPassword('password1')
      );
      const entranceInformation3: EntranceInformation = EntranceInformation.of(
        AccountName.of('name1'),
        new MockPassword('password2')
      );
      const entranceInformation4: EntranceInformation = EntranceInformation.of(
        AccountName.of('name2'),
        new MockPassword('password2')
      );
      const entranceInformation5: EntranceInformation = EntranceInformation.of(
        AccountName.of('name1'),
        new MockPassword('password1')
      );

      expect(entranceInformation1.equals(entranceInformation1)).toBe(true);
      expect(entranceInformation1.equals(entranceInformation2)).toBe(false);
      expect(entranceInformation1.equals(entranceInformation3)).toBe(false);
      expect(entranceInformation1.equals(entranceInformation4)).toBe(false);
      expect(entranceInformation1.equals(entranceInformation5)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const account: string = 'account';
      const password: string = 'password';
      const entranceInformation: EntranceInformation = EntranceInformation.of(
        AccountName.of(account),
        Password.of(password)
      );

      expect(entranceInformation.toString()).toBe(`${account} ${password}`);
    });
  });
});
