import sinon, { SinonSpy } from 'sinon';

import { Superposition } from '@jamashita/publikum-monad';
import { UUID } from '@jamashita/publikum-uuid';

import { RegionIDError } from '../Error/RegionIDError';
import { RegionID } from '../RegionID';

describe('RegionID', () => {
  describe('empty', () => {
    it('always returns 36 length string', () => {
      expect(RegionID.empty().get().get().length).toBe(36);
    });

    it('returns singleton instance', () => {
      expect(RegionID.empty()).toBe(RegionID.empty());
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();

      expect(RegionID.of(uuid1).get()).toBe(uuid1);
      expect(RegionID.of(uuid2).get()).toBe(uuid2);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const superposition: Superposition<RegionID, RegionIDError> = RegionID.ofString(uuid.get());

      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<RegionID, RegionIDError> = RegionID.ofString('quasi');

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: RegionIDError) => {
          spy2();
          expect(err).toBeInstanceOf(RegionIDError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const regionID1: RegionID = RegionID.of(uuid1);
      const regionID2: RegionID = RegionID.of(uuid2);
      const regionID3: RegionID = RegionID.of(uuid1);

      expect(regionID1.equals(regionID1)).toBe(true);
      expect(regionID1.equals(regionID2)).toBe(false);
      expect(regionID1.equals(regionID3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('when RegionID.empty() given , returns true', () => {
      expect(RegionID.empty().isEmpty()).toBe(true);
    });

    it('normal case', () => {
      expect(RegionID.of(UUID.v4()).isEmpty()).toBe(false);
      expect(RegionID.of(UUID.v4()).isEmpty()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: UUID = UUID.v4();
      const regionID: RegionID = RegionID.of(uuid);

      expect(regionID.toString()).toBe(uuid.toString());
    });
  });
});
