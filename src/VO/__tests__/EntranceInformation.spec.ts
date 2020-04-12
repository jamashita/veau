import { AccountName } from '../AccountName';
import { EntranceInformation } from '../EntranceInformation';
import { Password } from '../Password';
import { MockAccountName } from '../Mock/MockAccountName';
import { MockPassword } from '../Mock/MockPassword';

describe('EntranceInformation', () => {
  describe('default', () => {
    it('s account and password must be blank', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.default();

      expect(entranceInformation.getAccount().isDefault()).toEqual(true);
      expect(entranceInformation.getPassword().isDefault()).toEqual(true);
    });
  });

  describe('isAcceptable', () => {
    it('account is empty, then user is not able to login', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of(
        new MockAccountName(),
        new MockPassword('password')
      );

      expect(entranceInformation.isAcceptable()).toEqual(false);
    });

    it('password is empty, then user is not able to login', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of(
        new MockAccountName('name'),
        new MockPassword()
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
