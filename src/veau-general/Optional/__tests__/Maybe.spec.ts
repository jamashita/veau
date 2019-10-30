import 'jest';
import { maybe } from '../Maybe';
import { None } from '../None';
import { Some } from '../Some';

describe('Maybe', () => {
  describe('maybe', () => {
    it('when null and undefined given, generates None instance', () => {
      expect(maybe(1) instanceof Some).toEqual(true);
      expect(maybe(0) instanceof Some).toEqual(true);
      expect(maybe('a') instanceof Some).toEqual(true);
      expect(maybe('') instanceof Some).toEqual(true);
      expect(maybe(true) instanceof Some).toEqual(true);
      expect(maybe(false) instanceof Some).toEqual(true);
      expect(maybe(new Date()) instanceof Some).toEqual(true);
      expect(maybe({}) instanceof Some).toEqual(true);
      expect(maybe([]) instanceof Some).toEqual(true);
      expect(maybe(null) instanceof None).toEqual(true);
      expect(maybe(undefined) instanceof None).toEqual(true);
    });
  });
});
