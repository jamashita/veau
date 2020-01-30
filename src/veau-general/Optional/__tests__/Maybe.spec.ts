import 'jest';
import { maybe } from '../Maybe';
import { None } from '../None';
import { PrimitiveEqualable } from '../PrimitiveEqualable';
import { Some } from '../Some';

describe('Maybe', () => {
  describe('maybe', () => {
    it('when null and undefined given, generates None instance', () => {
      expect(maybe(PrimitiveEqualable.of(1)) instanceof Some).toEqual(true);
      expect(maybe(PrimitiveEqualable.of(0)) instanceof Some).toEqual(true);
      expect(maybe(PrimitiveEqualable.of('a')) instanceof Some).toEqual(true);
      expect(maybe(PrimitiveEqualable.of('')) instanceof Some).toEqual(true);
      expect(maybe(PrimitiveEqualable.of(true)) instanceof Some).toEqual(true);
      expect(maybe(PrimitiveEqualable.of(false)) instanceof Some).toEqual(true);
      expect(maybe(null) instanceof None).toEqual(true);
      expect(maybe(undefined) instanceof None).toEqual(true);
    });
  });
});
