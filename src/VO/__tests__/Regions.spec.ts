import { ImmutableSequence } from '../../General/Collection/Sequence/ImmutableSequence';
import { Absent } from '../../General/Quantum/Absent';
import { ISO3166 } from '../ISO3166';
import { MockISO3166 } from '../Mock/MockISO3166';
import { MockRegion } from '../Mock/MockRegion';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockRegionName } from '../Mock/MockRegionName';
import { Region, RegionJSON, RegionRow } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { Regions } from '../Regions';

describe('Regions', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns Regions.empty()', () => {
      const regions: Regions = Regions.of(ImmutableSequence.empty<Region>());

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      const sequence: ImmutableSequence<MockRegion> = ImmutableSequence.of<Region>([
        new MockRegion(),
        new MockRegion()
      ]);

      const regions: Regions = Regions.of(sequence);

      expect(regions.size()).toBe(sequence.size());
      for (let i: number = 0; i < regions.size(); i++) {
        expect(regions.get(i).get()).toBe(sequence.get(i).get());
      }
    });
  });

  describe('ofJSON', () => {
    it('when empty Array given, returns Regions.empty()', () => {
      const regions: Regions = Regions.ofJSON([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      const json: Array<RegionJSON> = [
        {
          regionID: 1,
          name: 'region 1',
          iso3166: 'abc'
        }
      ];

      const regions: Regions = Regions.ofJSON(json);

      expect(regions.size()).toBe(json.length);
      for (let i: number = 0; i < regions.size(); i++) {
        const region: Region = regions.get(i).get();
        expect(region.getRegionID().get()).toBe(json[i].regionID);
        expect(region.getName().get()).toBe(json[i].name);
        expect(region.getISO3166().get()).toBe(json[i].iso3166);
      }
    });
  });

  describe('ofRow', () => {
    it('when empty Array given, returns Regions.empty()', () => {
      const regions: Regions = Regions.ofRow([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      const rows: Array<RegionRow> = [
        {
          regionID: 1,
          name: 'region 1',
          iso3166: 'abc'
        }
      ];

      const regions: Regions = Regions.ofRow(rows);

      expect(regions.size()).toBe(rows.length);
      for (let i: number = 0; i < regions.size(); i++) {
        const region: Region = regions.get(i).get();
        expect(region.getRegionID().get()).toBe(rows[i].regionID);
        expect(region.getName().get()).toBe(rows[i].name);
        expect(region.getISO3166().get()).toBe(rows[i].iso3166);
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns Regions.empty()', () => {
      const regions: Regions = Regions.ofArray([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      const regs: Array<MockRegion> = [
        new MockRegion(),
        new MockRegion()
      ];

      const regions: Regions = Regions.ofArray(regs);

      expect(regions.size()).toBe(regs.length);
      for (let i: number = 0; i < regions.size(); i++) {
        expect(regions.get(i).get()).toBe(regs[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns Regions.empty()', () => {
      const regions: Regions = Regions.ofSpread();

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const regs: Array<MockRegion> = [
        region1,
        region2
      ];

      const regions: Regions = Regions.ofSpread(
        region1,
        region2
      );

      expect(regions.size()).toBe(regs.length);
      for (let i: number = 0; i < regions.size(); i++) {
        expect(regions.get(i).get()).toBe(regs[i]);
      }
    });
  });

  describe('empty', () => {
    it('generates 0-length Regions', () => {
      expect(Regions.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(Regions.empty()).toBe(Regions.empty());
    });
  });

  describe('get', () => {
    it('returns Region instance at the correct index', () => {
      const regs: Array<MockRegion> = [
        new MockRegion(),
        new MockRegion(),
        new MockRegion()
      ];

      const regions: Regions = Regions.ofArray(regs);

      expect(regions.size()).toBe(regs.length);
      for (let i: number = 0; i < regions.size(); i++) {
        expect(regions.get(i).get()).toBe(regs[i]);
      }
    });

    it('returns Absent when the index is out of range', () => {
      const regions: Regions = Regions.empty();

      expect(regions.get(-1)).toBeInstanceOf(Absent);
      expect(regions.get(0)).toBeInstanceOf(Absent);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion({
        regionID: new MockRegionID(2)
      });
      const region3: MockRegion = new MockRegion();
      const region4: MockRegion = new MockRegion({
        iso3166: new MockISO3166('OOP')
      });

      const regions: Regions = Regions.ofArray([
        region1,
        region2
      ]);

      expect(regions.contains(region1)).toBe(true);
      expect(regions.contains(region2)).toBe(true);
      expect(regions.contains(region3)).toBe(true);
      expect(regions.contains(region4)).toBe(false);
    });
  });

  describe('find', () => {
    it('returns Present if the element exists', () => {
      const region1: MockRegion = new MockRegion({
        regionID: new MockRegionID(1)
      });
      const region2: MockRegion = new MockRegion({
        regionID: new MockRegionID(2)
      });
      const region3: MockRegion = new MockRegion({
        regionID: new MockRegionID(1)
      });
      const region4: MockRegion = new MockRegion({
        regionID: new MockRegionID(3)
      });

      const regions: Regions = Regions.ofArray([
        region1,
        region2
      ]);

      expect(regions.find((region: Region) => {
        return region1.equals(region);
      }).isPresent()).toBe(true);
      expect(regions.find((region: Region) => {
        return region2.equals(region);
      }).isPresent()).toBe(true);
      expect(regions.find((region: Region) => {
        return region3.equals(region);
      }).isPresent()).toBe(true);
      expect(regions.find((region: Region) => {
        return region4.equals(region);
      }).isPresent()).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const regions1: Regions = Regions.empty();
      const regions2: Regions = Regions.ofArray([
        new MockRegion(),
        new MockRegion({
          regionID: new MockRegionID(2),
          name: new MockRegionName('region'),
          iso3166: new MockISO3166('abd')
        })
      ]);

      expect(regions1.isEmpty()).toBe(true);
      expect(regions2.isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion({
        regionID: new MockRegionID(2),
        name: new MockRegionName('region'),
        iso3166: new MockISO3166('abd')
      });

      const regions1: Regions = Regions.ofArray([
        region1,
        region2
      ]);
      const regions2: Regions = Regions.ofArray([
        region1
      ]);

      expect(regions1.equals(regions1)).toBe(true);
      expect(regions1.equals(regions2)).toBe(false);
    });

    it('returns false if the sequence is different', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion({
        regionID: new MockRegionID(2),
        name: new MockRegionName('region'),
        iso3166: new MockISO3166('abd')
      });

      const regions1: Regions = Regions.ofArray([
        region1,
        region2
      ]);
      const regions2: Regions = Regions.ofArray([
        region2,
        region1
      ]);

      expect(regions1.equals(regions1)).toBe(true);
      expect(regions1.equals(regions2)).toBe(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion({
        regionID: new MockRegionID(2),
        name: new MockRegionName('region'),
        iso3166: new MockISO3166('abd')
      });

      const regions1: Regions = Regions.ofArray([
        region1,
        region2
      ]);
      const regions2: Regions = Regions.ofArray([
        region1,
        region2
      ]);

      expect(regions1.equals(regions1)).toBe(true);
      expect(regions1.equals(regions2)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const regions: Regions = Regions.ofArray([
        Region.of(
          RegionID.of(1),
          RegionName.of('region 1'),
          ISO3166.of('abc')
        )
      ]);

      expect(regions.toJSON()).toEqual([
        {
          regionID: 1,
          name: 'region 1',
          iso3166: 'abc'
        }
      ]);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id1: number = 3;
      const id2: number = 4;
      const name1: string = 'region 1';
      const name2: string = 'region 2';
      const iso31661: string = 'abc';
      const iso31662: string = 'abd';

      const regions: Regions = Regions.ofArray([
        Region.of(
          RegionID.of(id1),
          RegionName.of(name1),
          ISO3166.of(iso31661)
        ),
        Region.of(
          RegionID.of(id2),
          RegionName.of(name2),
          ISO3166.of(iso31662)
        )
      ]);

      expect(regions.toString()).toBe(`${id1} ${name1} ${iso31661}, ${id2} ${name2} ${iso31662}`);
    });
  });
});
