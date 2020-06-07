import sinon, { SinonSpy } from 'sinon';

import { Superposition } from '@jamashita/publikum-monad';
import { UUID } from '@jamashita/publikum-uuid';

import { RegionError } from '../Error/RegionError';
import { ISO3166 } from '../ISO3166';
import { MockISO3166 } from '../Mock/MockISO3166';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockRegionName } from '../Mock/MockRegionName';
import { Region, RegionJSON, RegionRow } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';

describe('Region', () => {
  describe('of', () => {
    it('normal case', () => {
      const regionID: MockRegionID = new MockRegionID();
      const name: MockRegionName = new MockRegionName();
      const iso3166: MockISO3166 = new MockISO3166();

      const region: Region = Region.of(regionID, name, iso3166);

      expect(region.getRegionID()).toBe(regionID);
      expect(region.getName()).toBe(name);
      expect(region.getISO3166()).toBe(iso3166);
    });

    it('returns Region.empty() if RegionID is empty', () => {
      const region: Region = Region.of(RegionID.empty(), new MockRegionName(), new MockISO3166());

      expect(region).toBe(Region.empty());
    });

    it('returns Region.empty() if RegionName is empty', () => {
      const region: Region = Region.of(new MockRegionID(), RegionName.empty(), new MockISO3166());

      expect(region).toBe(Region.empty());
    });

    it('returns Region.empty() if ISO3166 is empty', () => {
      const region: Region = Region.of(new MockRegionID(), new MockRegionName(), ISO3166.empty());

      expect(region).toBe(Region.empty());
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      const json: RegionJSON = {
        regionID: UUID.v4().get(),
        name: 'Albania',
        iso3166: 'ALB'
      };

      const superposition: Superposition<Region, RegionError> = Region.ofJSON(json);

      expect(superposition.isAlive()).toBe(true);
      const region: Region = superposition.get();

      expect(region.getRegionID().get().get()).toBe(json.regionID);
      expect(region.getName().get()).toBe(json.name);
      expect(region.getISO3166().get()).toBe(json.iso3166);
    });

    it('returns Dead if regionID is malformat', () => {
      const json: RegionJSON = {
        regionID: 'puente',
        name: 'Albania',
        iso3166: 'ALB'
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Region, RegionError> = Region.ofJSON(json);

      expect(superposition.isDead()).toBe(true);
      superposition.transform<void>(
        () => {
          spy1();
        },
        (err: RegionError) => {
          spy2();
          expect(err).toBeInstanceOf(RegionError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: RegionRow = {
        regionID: UUID.v4().get(),
        name: 'Albania',
        iso3166: 'ALB'
      };

      const superposition: Superposition<Region, RegionError> = Region.ofRow(row);

      expect(superposition.isAlive()).toBe(true);
      const region: Region = superposition.get();

      expect(region.getRegionID().get().get()).toBe(row.regionID);
      expect(region.getName().get()).toBe(row.name);
      expect(region.getISO3166().get()).toBe(row.iso3166);
    });

    it('returns Dead if regionID is malformat', () => {
      const row: RegionRow = {
        regionID: 'puente',
        name: 'Albania',
        iso3166: 'ALB'
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Region, RegionError> = Region.ofRow(row);

      expect(superposition.isDead()).toBe(true);
      superposition.transform<void>(
        () => {
          spy1();
        },
        (err: RegionError) => {
          spy2();
          expect(err).toBeInstanceOf(RegionError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      const n: unknown = {
        regionID: 'to to',
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.isJSON(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(Region.isJSON(null)).toBe(false);
      expect(Region.isJSON(undefined)).toBe(false);
      expect(Region.isJSON(56)).toBe(false);
      expect(Region.isJSON('fjafsd')).toBe(false);
      expect(Region.isJSON(false)).toBe(false);
    });

    it('returns false because regionID is missing', () => {
      const n: unknown = {
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.isJSON(n)).toBe(false);
    });

    it('returns false because regionID is not string', () => {
      const n: unknown = {
        regionID: 2,
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.isJSON(n)).toBe(false);
    });

    it('returns false because name is missing', () => {
      const n: unknown = {
        regionID: 'to to',
        iso3166: 'ALB'
      };

      expect(Region.isJSON(n)).toBe(false);
    });

    it('returns false because name is not string', () => {
      const n: unknown = {
        regionID: 'to to',
        name: true,
        iso3166: 'ALB'
      };

      expect(Region.isJSON(n)).toBe(false);
    });

    it('returns false because iso3166 is missing', () => {
      const n: unknown = {
        regionID: 'to to',
        name: 'Albania'
      };

      expect(Region.isJSON(n)).toBe(false);
    });

    it('returns false because iso3166 is not string', () => {
      const n: unknown = {
        regionID: 'to to',
        name: 'Albania',
        iso3166: -5
      };

      expect(Region.isJSON(n)).toBe(false);
    });
  });

  describe('empty', () => {
    it('returns each default value', () => {
      const region: Region = Region.empty();

      expect(region.getRegionID()).toBe(RegionID.empty());
      expect(region.getName()).toBe(RegionName.empty());
      expect(region.getISO3166()).toBe(ISO3166.empty());
    });

    it('returns singleton instance', () => {
      expect(Region.empty()).toBe(Region.empty());
    });
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
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
      const uuid: UUID = UUID.v4();
      const region: Region = Region.of(RegionID.of(uuid), RegionName.of('Afghanistan'), ISO3166.of('AFG'));

      expect(region.toJSON()).toEqual({
        regionID: uuid.get(),
        name: 'Afghanistan',
        iso3166: 'AFG'
      });
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: UUID = UUID.v4();
      const name: string = 'region 1';
      const iso3166: string = 'abc';

      const region: Region = Region.of(RegionID.of(uuid), RegionName.of(name), ISO3166.of(iso3166));

      expect(region.toString()).toBe(`${uuid.get()} ${name} ${iso3166}`);
    });
  });
});
