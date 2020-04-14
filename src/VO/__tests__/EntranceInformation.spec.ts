import { AccountName } from '../AccountName';
import { EntranceInformation } from '../EntranceInformation';
import { MockAccountName } from '../Mock/MockAccountName';
import { MockPassword } from '../Mock/MockPassword';
import { Password } from '../Password';

// DONE
describe('EntranceInformation', () => {
  describe('empty', () => {
    it('\'s account and password must also be empty', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.empty();

      expect(entranceInformation.getAccount().isEmpty()).toEqual(true);
      expect(entranceInformation.getPassword().isEmpty()).toEqual(true);
    });

    it('returns singleton instance', () => {
      expect(EntranceInformation.empty()).toBe(EntranceInformation.empty());
    });
  });

  describe('of', () => {
    it('returns EntranceInformation.empty() when AccountName and Password is blank', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of(
        AccountName.empty(),
        Password.empty()
      );

      expect(entranceInformation).toBe(EntranceInformation.empty());
    });

    it('normal case', () => {
      const name: string = 'name';
      const password: string = 'password';
      const entranceInformation: EntranceInformation = EntranceInformation.of(
        AccountName.of(name),
        Password.of(password)
      );

      expect(entranceInformation.getAccount().get()).toEqual(name);
      expect(entranceInformation.getPassword().get()).toEqual(password);
    });
  });

  describe('isAcceptable', () => {
    it('returns false if the both are not filled', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of(
        AccountName.empty(),
        Password.empty()
      );

      expect(entranceInformation.isAcceptable()).toEqual(false);
    });

    it('account is empty, then user is not able to login', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of(
        AccountName.empty(),
        new MockPassword('password')
      );

      expect(entranceInformation.isAcceptable()).toEqual(false);
    });

    it('password is empty, then user is not able to login', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of(
        new MockAccountName('name'),
        Password.empty()
      );

      expect(entranceInformation.isAcceptable()).toEqual(false);
    });

    it('account and password are filled then user is able to attempt login', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of(
        new MockAccountName('name'),
        new MockPassword('password')
      );

      expect(entranceInformation.isAcceptable()).toEqual(true);
    });
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const entranceInformation1: EntranceInformation = EntranceInformation.of(
        new MockAccountName('name1'),
        new MockPassword('password1')
      );
      const entranceInformation2: EntranceInformation = EntranceInformation.of(
        new MockAccountName('name2'),
        new MockPassword('password1')
      );
      const entranceInformation3: EntranceInformation = EntranceInformation.of(
        new MockAccountName('name1'),
        new MockPassword('password2')
      );
      const entranceInformation4: EntranceInformation = EntranceInformation.of(
        new MockAccountName('name2'),
        new MockPassword('password2')
      );
      const entranceInformation5: EntranceInformation = EntranceInformation.of(
        new MockAccountName('name1'),
        new MockPassword('password1')
      );

      expect(entranceInformation1.equals(entranceInformation1)).toEqual(true);
      expect(entranceInformation1.equals(entranceInformation2)).toEqual(false);
      expect(entranceInformation1.equals(entranceInformation3)).toEqual(false);
      expect(entranceInformation1.equals(entranceInformation4)).toEqual(false);
      expect(entranceInformation1.equals(entranceInformation5)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const account: string = 'account';
      const password: string = 'password';
      const entranceInformation: EntranceInformation = EntranceInformation.of(
        AccountName.of(account),
        Password.of(password)
      );

      expect(entranceInformation.toString()).toEqual(`${account} ${password}`);
    });
  });
});
