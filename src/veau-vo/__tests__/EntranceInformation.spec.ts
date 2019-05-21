import 'jest';
import { EntranceInformation } from '../EntranceInformation';

describe('EntranceInformation', () => {
  describe('isAcceptable', () => {
    it('account is empty, then user is not able to login', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of('', 'password');

      expect(entranceInformation.isAcceptable()).toEqual(false);
    });

    it('password is empty, then user is not able to login', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of('name', '');

      expect(entranceInformation.isAcceptable()).toEqual(false);
    });

    it('account and password are filled then user is able to attempt login', () => {
      const entranceInformation: EntranceInformation = EntranceInformation.of('name', 'password');

      expect(entranceInformation.isAcceptable()).toEqual(true);
    });
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const entranceInformation1: EntranceInformation = EntranceInformation.of('account1', 'password1');
      const entranceInformation2: EntranceInformation = EntranceInformation.of('account1', 'password2');
      const entranceInformation3: EntranceInformation = EntranceInformation.of('account2', 'password1');
      const entranceInformation4: EntranceInformation = EntranceInformation.of('account1', 'password1');

      expect(entranceInformation1.equals(entranceInformation1)).toEqual(true);
      expect(entranceInformation1.equals(entranceInformation2)).toEqual(false);
      expect(entranceInformation1.equals(entranceInformation3)).toEqual(false);
      expect(entranceInformation1.equals(entranceInformation4)).toEqual(true);
    });
  });
});
