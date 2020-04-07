import { AccountName } from '../AccountName';
import { EntranceInformation } from '../EntranceInformation';
import { Password } from '../Password';

describe('EntranceInformation', () => {
  describe('isAcceptable', () => {
    it('account is empty, then user is not able to login', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of(AccountName.default(), Password.of('password'));

      expect(entranceInformation.isAcceptable()).toEqual(false);
    });

    it('password is empty, then user is not able to login', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of(AccountName.of('name'), Password.default());

      expect(entranceInformation.isAcceptable()).toEqual(false);
    });

    it('account and password are filled then user is able to attempt login', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of(AccountName.of('name'), Password.of('password'));

      expect(entranceInformation.isAcceptable()).toEqual(true);
    });
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const entranceInformation1: EntranceInformation = EntranceInformation.of(AccountName.of('account1'), Password.of('password1'));
      const entranceInformation2: EntranceInformation = EntranceInformation.of(AccountName.of('account1'), Password.of('password2'));
      const entranceInformation3: EntranceInformation = EntranceInformation.of(AccountName.of('account2'), Password.of('password1'));
      const entranceInformation4: EntranceInformation = EntranceInformation.of(AccountName.of('account1'), Password.of('password1'));

      expect(entranceInformation1.equals(entranceInformation1)).toEqual(true);
      expect(entranceInformation1.equals(entranceInformation2)).toEqual(false);
      expect(entranceInformation1.equals(entranceInformation3)).toEqual(false);
      expect(entranceInformation1.equals(entranceInformation4)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const account: string = 'account';
      const password: string = 'password';
      const entranceInformation: EntranceInformation = EntranceInformation.of(AccountName.of(account), Password.of(password));

      expect(entranceInformation.toString()).toEqual(`${account} ${password}`);
    });
  });

  describe('default', () => {
    it('s account and password must be blank', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.default();

      expect(entranceInformation.getAccount().isDefault()).toEqual(true);
      expect(entranceInformation.getPassword().isDefault()).toEqual(true);
    });
  });
});
