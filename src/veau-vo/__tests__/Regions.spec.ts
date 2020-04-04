import 'jest';
import { None } from '../../veau-general/Optional/None';
import { ISO3166 } from '../ISO3166';
import { Region, RegionJSON, RegionRow } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { Regions } from '../Regions';

describe('Regions', () => {
  describe('get', () => {
    it('returns Region instance at the correct index', () => {
      const region1: Region = Region.of(RegionID.of(1), RegionName.of('region 1'), ISO3166.of('abc'));
      const region2: Region = Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abd'));
      const region3: Region = Region.of(RegionID.of(3), RegionName.of('region 3'), ISO3166.of('abe'));

      const regions: Regions = Regions.of([region1, region2, region3]);

      expect(regions.size()).toEqual(3);
      expect(regions.get(0).get()).toEqual(region1);
      expect(regions.get(1).get()).toEqual(region2);
      expect(regions.get(2).get()).toEqual(region3);
    });

    it('returns None when the index is out of range', () => {
      const regions: Regions = Regions.empty();

      expect(regions.get(-1)).toBeInstanceOf(None);
      expect(regions.get(0)).toBeInstanceOf(None);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the Colors', () => {
      const region1: Region = Region.of(RegionID.of(1), RegionName.of('region 1'), ISO3166.of('abc'));
      const region2: Region = Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abd'));
      const region3: Region = Region.of(RegionID.of(1), RegionName.of('region 1'), ISO3166.of('abc'));
      const region4: Region = Region.of(RegionID.of(3), RegionName.of('region 3'), ISO3166.of('abe'));

      const regions: Regions = Regions.of([region1, region2]);

      expect(regions.contains(region1)).toEqual(true);
      expect(regions.contains(region2)).toEqual(true);
      expect(regions.contains(region3)).toEqual(true);
      expect(regions.contains(region4)).toEqual(false);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const region1: Region = Region.of(RegionID.of(1), RegionName.of('region 1'), ISO3166.of('abc'));
      const region2: Region = Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abd'));

      const regions1: Regions = Regions.empty();
      const regions2: Regions = Regions.of([region1, region2]);

      expect(regions1.isEmpty()).toEqual(true);
      expect(regions2.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const region1: Region = Region.of(RegionID.of(1), RegionName.of('region 1'), ISO3166.of('abc'));
      const region2: Region = Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abd'));

      const regions1: Regions = Regions.of([region1, region2]);
      const regions2: Regions = Regions.of([region1]);

      expect(regions1.equals(regions1)).toEqual(true);
      expect(regions1.equals(regions2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const region1: Region = Region.of(RegionID.of(1), RegionName.of('region 1'), ISO3166.of('abc'));
      const region2: Region = Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abd'));

      const regions1: Regions = Regions.of([region1, region2]);
      const regions2: Regions = Regions.of([region2, region1]);

      expect(regions1.equals(regions1)).toEqual(true);
      expect(regions1.equals(regions2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const region1: Region = Region.of(RegionID.of(1), RegionName.of('region 1'), ISO3166.of('abc'));
      const region2: Region = Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abd'));

      const regions1: Regions = Regions.of([region1, region2]);
      const regions2: Regions = Regions.of([region1, region2]);

      expect(regions1.equals(regions1)).toEqual(true);
      expect(regions1.equals(regions2)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const region1: Region = Region.of(RegionID.of(1), RegionName.of('region 1'), ISO3166.of('abc'));

      const regions: Regions = Regions.of([region1]);

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
      const region1: Region = Region.of(RegionID.of(id1), RegionName.of(name1), ISO3166.of(iso31661));
      const region2: Region = Region.of(RegionID.of(id2), RegionName.of(name2), ISO3166.of(iso31662));
      const regions: Regions = Regions.of([region1, region2]);

      expect(regions.toString()).toEqual(`${id1} ${name1} ${iso31661}, ${id2} ${name2} ${iso31662}`);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      const json: Array<RegionJSON> = [
        {
          regionID: 1,
          name: 'region 1',
          iso3166: 'abc'
        }
      ];

      const regions: Regions = Regions.ofJSON(json);

      expect(regions.size()).toEqual(1);
      const region: Region = regions.get(0).get();
      expect(region.getRegionID().get()).toEqual(json[0].regionID);
      expect(region.getName().get()).toEqual(json[0].name);
      expect(region.getISO3166().get()).toEqual(json[0].iso3166);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const rows: Array<RegionRow> = [
        {
          regionID: 1,
          name: 'region 1',
          iso3166: 'abc'
        }
      ];

      const regions: Regions = Regions.ofRow(rows);

      expect(regions.size()).toEqual(1);
      const region: Region = regions.get(0).get();
      expect(region.getRegionID().get()).toEqual(rows[0].regionID);
      expect(region.getName().get()).toEqual(rows[0].name);
      expect(region.getISO3166().get()).toEqual(rows[0].iso3166);
    });
  });

  describe('empty', () => {
    it('generates 0-length Regions', () => {
      expect(Regions.empty().size()).toEqual(0);
    });
  });
});
