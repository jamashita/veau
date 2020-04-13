import { Password } from '../Password';

// DONE
describe('Password', () => {
  describe('empty', () => {
    it('must be an blank password', () => {
      expect(Password.empty().get()).toEqual('');
    });

    it('returns singleton instance', () => {
      expect(Password.empty()).toEqual(Password.empty());
    });
  });

  describe('of', () => {
    it('returns Password.empty() when empty string is given', () => {
      expect(Password.of('')).toBe(Password.empty());
    });

    it('normal case', () => {
      const pasword1: string = 'password 1';
      const pasword2: string = 'password 2';

      expect(Password.of(pasword1).get()).toEqual(pasword1);
      expect(Password.of(pasword2).get()).toEqual(pasword2);
    });
  });

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

  describe('isEmpty', () => {
    it('when Password.empty() is given, returns true', () => {
      expect(Password.empty().isEmpty()).toEqual(true);
    });

    it('returns true if the password is empty string', () => {
      expect(Password.of('').isEmpty()).toEqual(true);
    });

    it('otherwise, returns false', () => {
      expect(Password.of('s').isEmpty()).toEqual(false);
      expect(Password.of('public servant').isEmpty()).toEqual(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const word: string = 'aiutare';
      const password: Password = Password.of(word);

      expect(password.toString()).toEqual(word);
    });
  });
});
