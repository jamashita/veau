import { RegionID } from '../RegionID';

describe('RegionID', () => {
  describe('empty', () => {
    it('always returns 0', () => {
      expect(RegionID.empty().get()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(RegionID.empty()).toBe(RegionID.empty());
    });
  });

  describe('of', () => {
    it('returns RegionID.empty() when 0 is given', () => {
      expect(RegionID.of(0)).toBe(RegionID.empty());
    });

    it('returns RegionID.empty() when negative values are given', () => {
      expect(RegionID.of(-9)).toBe(RegionID.empty());
      expect(RegionID.of(-53)).toBe(RegionID.empty());
    });

    it('returns RegionID.empty() when doble values are given', () => {
      expect(RegionID.of(0.8)).toBe(RegionID.empty());
      expect(RegionID.of(12.45)).toBe(RegionID.empty());
    });

    it('normal case', () => {
      const id1: number = 1;
      const id2: number = 10;

      expect(RegionID.of(id1).get()).toBe(id1);
      expect(RegionID.of(id2).get()).toBe(id2);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const regionID1: RegionID = RegionID.of(1);
      const regionID2: RegionID = RegionID.of(2);
      const regionID3: RegionID = RegionID.of(1);

      expect(regionID1.equals(regionID1)).toBe(true);
      expect(regionID1.equals(regionID2)).toBe(false);
      expect(regionID1.equals(regionID3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('when RegionID.empty() given , returns true', () => {
      expect(RegionID.empty().isEmpty()).toBe(true);
    });

    it('when negative values given , returns true', () => {
      expect(RegionID.of(-1).isEmpty()).toBe(true);
      expect(RegionID.of(-11).isEmpty()).toBe(true);
    });

    it('when double value is given, returns true', () => {
      expect(RegionID.of(1.1).isEmpty()).toBe(true);
      expect(RegionID.of(2.5).isEmpty()).toBe(true);
    });

    it('otherwise returns false', () => {
      expect(RegionID.of(1).isEmpty()).toBe(false);
      expect(RegionID.of(105).isEmpty()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const id: number = 1;
      const regionID: RegionID = RegionID.of(id);

      expect(regionID.toString()).toBe(id.toString());
    });
  });
});
