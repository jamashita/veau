import { UUID } from '@jamashita/anden-uuid';
import { RegionError } from '../error/RegionError';
import { ISO3166 } from '../ISO3166';
import { MockISO3166 } from '../mock/MockISO3166';
import { MockRegionID } from '../mock/MockRegionID';
import { MockRegionName } from '../mock/MockRegionName';
import { Region, RegionJSON, RegionRow } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';

describe('Region', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(3);

      const regionID: MockRegionID = new MockRegionID();
      const name: MockRegionName = new MockRegionName();
      const iso3166: MockISO3166 = new MockISO3166();

      const region: Region = Region.of(regionID, name, iso3166);

      expect(region.getRegionID()).toBe(regionID);
      expect(region.getName()).toBe(name);
      expect(region.getISO3166()).toBe(iso3166);
    });

    it('returns Region.empty() if RegionID is empty', () => {
      expect.assertions(1);

      const region: Region = Region.of(RegionID.empty(), new MockRegionName(), new MockISO3166());

      expect(region).toBe(Region.empty());
    });

    it('returns Region.empty() if RegionName is empty', () => {
      expect.assertions(1);

      const region: Region = Region.of(new MockRegionID(), RegionName.empty(), new MockISO3166());

      expect(region).toBe(Region.empty());
    });

    it('returns Region.empty() if ISO3166 is empty', () => {
      expect.assertions(1);

      const region: Region = Region.of(new MockRegionID(), new MockRegionName(), ISO3166.empty());

      expect(region).toBe(Region.empty());
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      expect.assertions(3);

      const json: RegionJSON = {
        regionID: UUID.v4().get(),
        name: 'Albania',
        iso3166: 'ALB'
      };

      const region: Region = Region.ofJSON(json);

      expect(region.getRegionID().get().get()).toBe(json.regionID);
      expect(region.getName().get()).toBe(json.name);
      expect(region.getISO3166().get()).toBe(json.iso3166);
    });

    it('returns Dead if regionID is malformat', () => {
      expect.assertions(1);

      const json: RegionJSON = {
        regionID: 'puente',
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(() => {
        Region.ofJSON(json);
      }).toThrow(RegionError);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      expect.assertions(3);

      const row: RegionRow = {
        regionID: UUID.v4().get(),
        name: 'Albania',
        iso3166: 'ALB'
      };

      const region: Region = Region.ofRow(row);

      expect(region.getRegionID().get().get()).toBe(row.regionID);
      expect(region.getName().get()).toBe(row.name);
      expect(region.getISO3166().get()).toBe(row.iso3166);
    });

    it('returns Dead if regionID is malformat', () => {
      expect.assertions(1);

      const row: RegionRow = {
        regionID: 'puente',
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(() => {
        Region.ofRow(row);
      }).toThrow(RegionError);
    });
  });

  describe('validate', () => {
    it('normal case', () => {
      expect.assertions(1);

      const n: unknown = {
        regionID: 'to to',
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect.assertions(5);

      expect(Region.validate(null)).toBe(false);
      expect(Region.validate(undefined)).toBe(false);
      expect(Region.validate(56)).toBe(false);
      expect(Region.validate('fjafsd')).toBe(false);
      expect(Region.validate(false)).toBe(false);
    });

    it('returns false because regionID is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.validate(n)).toBe(false);
    });

    it('returns false because regionID is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        regionID: 2,
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.validate(n)).toBe(false);
    });

    it('returns false because name is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        regionID: 'to to',
        iso3166: 'ALB'
      };

      expect(Region.validate(n)).toBe(false);
    });

    it('returns false because name is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        regionID: 'to to',
        name: true,
        iso3166: 'ALB'
      };

      expect(Region.validate(n)).toBe(false);
    });

    it('returns false because iso3166 is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        regionID: 'to to',
        name: 'Albania'
      };

      expect(Region.validate(n)).toBe(false);
    });

    it('returns false because iso3166 is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        regionID: 'to to',
        name: 'Albania',
        iso3166: -5
      };

      expect(Region.validate(n)).toBe(false);
    });
  });

  describe('empty', () => {
    it('returns each default value', () => {
      expect.assertions(3);

      const region: Region = Region.empty();

      expect(region.getRegionID()).toBe(RegionID.empty());
      expect(region.getName()).toBe(RegionName.empty());
      expect(region.getISO3166()).toBe(ISO3166.empty());
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(Region.empty()).toBe(Region.empty());
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const region: Region = Region.empty();

      expect(region.equals(null)).toBe(false);
      expect(region.equals(undefined)).toBe(false);
      expect(region.equals('')).toBe(false);
      expect(region.equals('123')).toBe(false);
      expect(region.equals('abcd')).toBe(false);
      expect(region.equals(123)).toBe(false);
      expect(region.equals(0)).toBe(false);
      expect(region.equals(-12)).toBe(false);
      expect(region.equals(0.3)).toBe(false);
      expect(region.equals(false)).toBe(false);
      expect(region.equals(true)).toBe(false);
      expect(region.equals(Symbol('p'))).toBe(false);
      expect(region.equals(20n)).toBe(false);
      expect(region.equals({})).toBe(false);
      expect(region.equals([])).toBe(false);
      expect(region.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the all properties are the same', () => {
      expect.assertions(5);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const region1: Region = Region.of(
        new MockRegionID(uuid1),
        new MockRegionName('Afghanistan'),
        new MockISO3166('AFG')
      );
      const region2: Region = Region.of(
        new MockRegionID(uuid2),
        new MockRegionName('Afghanistan'),
        new MockISO3166('AFG')
      );
      const region3: Region = Region.of(new MockRegionID(uuid1), new MockRegionName('Albania'), new MockISO3166('AFG'));
      const region4: Region = Region.of(
        new MockRegionID(uuid1),
        new MockRegionName('Afghanistan'),
        new MockISO3166('AFB')
      );
      const region5: Region = Region.of(
        new MockRegionID(uuid1),
        new MockRegionName('Afghanistan'),
        new MockISO3166('AFG')
      );

      expect(region1.equals(region1)).toBe(true);
      expect(region1.equals(region2)).toBe(false);
      expect(region1.equals(region3)).toBe(false);
      expect(region1.equals(region4)).toBe(false);
      expect(region1.equals(region5)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();
      const region: Region = Region.of(RegionID.of(uuid), RegionName.of('Afghanistan'), ISO3166.of('AFG'));

      expect(region.toJSON()).toStrictEqual({
        regionID: uuid.get(),
        name: 'Afghanistan',
        iso3166: 'AFG'
      });
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();
      const name: string = 'region 1';
      const iso3166: string = 'abc';

      const region: Region = Region.of(RegionID.of(uuid), RegionName.of(name), ISO3166.of(iso3166));

      expect(region.toString()).toBe(`${uuid.get()} ${name} ${iso3166}`);
    });
  });
});
