import { Password } from '../Password';

describe('Password', () => {
  describe('empty', () => {
    it('must be an blank password', () => {
      expect.assertions(1);

      expect(Password.empty().get()).toBe('');
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(Password.empty()).toBe(Password.empty());
    });
  });

  describe('of', () => {
    it('returns Password.empty() when empty string is given', () => {
      expect.assertions(1);

      expect(Password.of('')).toBe(Password.empty());
    });

    it('normal case', () => {
      expect.assertions(2);

      const pasword1: string = 'password 1';
      const pasword2: string = 'password 2';

      expect(Password.of(pasword1).get()).toBe(pasword1);
      expect(Password.of(pasword2).get()).toBe(pasword2);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const password: Password = Password.empty();

      expect(password.equals(null)).toBe(false);
      expect(password.equals(undefined)).toBe(false);
      expect(password.equals('')).toBe(false);
      expect(password.equals('123')).toBe(false);
      expect(password.equals('abcd')).toBe(false);
      expect(password.equals(123)).toBe(false);
      expect(password.equals(0)).toBe(false);
      expect(password.equals(-12)).toBe(false);
      expect(password.equals(0.3)).toBe(false);
      expect(password.equals(false)).toBe(false);
      expect(password.equals(true)).toBe(false);
      expect(password.equals(Symbol('p'))).toBe(false);
      expect(password.equals(20n)).toBe(false);
      expect(password.equals({})).toBe(false);
      expect(password.equals([])).toBe(false);
      expect(password.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      expect.assertions(3);

      const password1: Password = Password.of('password 1');
      const password2: Password = Password.of('password 2');
      const password3: Password = Password.of('password 1');

      expect(password1.equals(password1)).toBe(true);
      expect(password1.equals(password2)).toBe(false);
      expect(password1.equals(password3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('when Password.empty() is given, returns true', () => {
      expect.assertions(1);

      expect(Password.empty().isEmpty()).toBe(true);
    });

    it('returns true if the password is empty string', () => {
      expect.assertions(1);

      expect(Password.of('').isEmpty()).toBe(true);
    });

    it('otherwise, returns false', () => {
      expect.assertions(2);

      expect(Password.of('s').isEmpty()).toBe(false);
      expect(Password.of('public servant').isEmpty()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const word: string = 'aiutare';
      const password: Password = Password.of(word);

      expect(password.toString()).toBe(word);
    });
  });
});
