import { MockNominative } from '../../../Mock/MockNominative';
import { ImmutableAddress } from '../ImmutableAddress';

describe('ImmutableAddress', () => {
  describe('of', () => {
    it('when the arguments specified with 0 length array, returns singleton', () => {
      const address: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>()
      );

      expect(address.isEmpty()).toEqual(true);
      expect(address).toBe(ImmutableAddress.empty<MockNominative<number>>());
    });

    it('normal case', () => {
      const address1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([
          new MockNominative<number>(1),
          new MockNominative<number>(3)
        ])
      );
      const address2: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([
          new MockNominative<number>(2),
          new MockNominative<number>(4),
          new MockNominative<number>(5)
        ])
      );

      expect(address1.size()).toEqual(2);
      expect(address2.size()).toEqual(3);
    });
  });

  describe('ofMap', () => {
    //
  });

  describe('empty', () => {
    //
  });

  describe('add', () => {
    //
  });

  describe('remove', () => {
    //
  });

  describe('isEmpty', () => {
    //
  });

  describe('duplicate', () => {
    //
  });
});
