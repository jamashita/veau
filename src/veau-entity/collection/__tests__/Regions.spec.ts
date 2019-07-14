import 'jest';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { RegionID } from '../../../veau-vo/RegionID';
import { Region, RegionJSON, RegionRow } from '../../Region';
import { Regions } from '../Regions';

describe('Regions', () => {
  describe('get', () => {
    it('returns Region instance at the correct index', () => {
      const region1: Region = Region.from(RegionID.of(1), 'region 1', ISO3166.of('abc'));
      const region2: Region = Region.from(RegionID.of(2), 'region 2', ISO3166.of('abd'));
      const region3: Region = Region.from(RegionID.of(3), 'region 3', ISO3166.of('abe'));

      const regions: Regions = Regions.from([region1, region2, region3]);

      expect(regions.length()).toEqual(3);
      expect(regions.get(0)).toEqual(region1);
      expect(regions.get(1)).toEqual(region2);
      expect(regions.get(2)).toEqual(region3);
    });

    it('throws error when the index is out of range', () => {
      const regions: Regions = Regions.from([]);

      expect(() => {
        regions.get(-1);
      }).toThrow(NoSuchElementError);
      expect(() => {
        regions.get(0);
      }).toThrow(NoSuchElementError);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const region1: Region = Region.from(RegionID.of(1), 'region 1', ISO3166.of('abc'));
      const region2: Region = Region.from(RegionID.of(2), 'region 2', ISO3166.of('abd'));

      const regions1: Regions = Regions.from([region1, region2]);
      const regions2: Regions = Regions.from([region1]);

      expect(regions1.equals(regions2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const region1: Region = Region.from(RegionID.of(1), 'region 1', ISO3166.of('abc'));
      const region2: Region = Region.from(RegionID.of(2), 'region 2', ISO3166.of('abd'));

      const regions1: Regions = Regions.from([region1, region2]);
      const regions2: Regions = Regions.from([region2, region1]);

      expect(regions1.equals(regions2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const region1: Region = Region.from(RegionID.of(1), 'region 1', ISO3166.of('abc'));
      const region2: Region = Region.from(RegionID.of(2), 'region 2', ISO3166.of('abd'));

      const regions1: Regions = Regions.from([region1, region2]);
      const regions2: Regions = Regions.from([region1, region2]);

      expect(regions1.equals(regions2)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const region1: Region = Region.from(RegionID.of(1), 'region 1', ISO3166.of('abc'));

      const regions: Regions = Regions.from([region1]);

      expect(regions.toJSON()).toEqual([
        {
          regionID: 1,
          name: 'region 1',
          iso3166: 'abc'
        }
      ]);
    });
  });

  describe('fromJSON', () => {
    it('normal case', () => {
      const json: Array<RegionJSON> = [
        {
          regionID: 1,
          name: 'region 1',
          iso3166: 'abc'
        }
      ];

      const regions: Regions = Regions.fromJSON(json);

      expect(regions.length()).toEqual(1);
      expect(regions.get(0).getRegionID().get()).toEqual(1);
      expect(regions.get(0).getName()).toEqual('region 1');
      expect(regions.get(0).getISO3166().get()).toEqual('abc');
    });
  });

  describe('fromRow', () => {
    it('normal case', () => {
      const rows: Array<RegionRow> = [
        {
          regionID: 1,
          name: 'region 1',
          iso3166: 'abc'
        }
      ];

      const regions: Regions = Regions.fromRow(rows);

      expect(regions.length()).toEqual(1);
      expect(regions.get(0).getRegionID().get()).toEqual(1);
      expect(regions.get(0).getName()).toEqual('region 1');
      expect(regions.get(0).getISO3166().get()).toEqual('abc');
    });
  });
});
