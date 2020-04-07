import { Password } from '../Password';

describe('Password', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const password1: Password = Password.of('password 1');
      const password2: Password = Password.of('password 2');
      const password3: Password = Password.of('password 1');

      expect(password1.equals(password1)).toEqual(true);
      expect(password1.equals(password2)).toEqual(false);
      expect(password1.equals(password3)).toEqual(true);
    });
  });

  describe('isDefault', () => {
    it('retunrns true if the passwrord is empty string', () => {
      const password1: Password = Password.default();
      const password2: Password = Password.of('');
      const password3: Password = Password.of('s');

      expect(password1.isDefault()).toEqual(true);
      expect(password2.isDefault()).toEqual(true);
      expect(password3.isDefault()).toEqual(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const word: string = 'aiutare';
      const password: Password = Password.of(word);

      expect(password.toString()).toEqual(word);
    });
  });

  describe('default', () => {
    it('must be an blank password', () => {
      expect(Password.default().get()).toEqual('');
    });
  });
});
