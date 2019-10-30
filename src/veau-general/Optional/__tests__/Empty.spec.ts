import 'jest';
import { empty } from '../Empty';
import { None } from '../None';

describe('Empty', () => {
  describe('empty', () => {
    it('always generates None instance', () => {
      expect(empty<string>() instanceof None).toEqual(true);
      expect(empty<number>() instanceof None).toEqual(true);
      expect(empty<boolean>() instanceof None).toEqual(true);
      expect(empty<null>() instanceof None).toEqual(true);
      expect(empty<void>() instanceof None).toEqual(true);
      expect(empty<object>() instanceof None).toEqual(true);
    });
  });
});
