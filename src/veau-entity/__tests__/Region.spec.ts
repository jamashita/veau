/* tslint:disable */
import 'jest';
import { ISO3166 } from '@/veau-vo/ISO3166';
import { RegionID } from '@/veau-vo/RegionID';
import { Region } from '../Region';

describe('Region', () => {
  it('equals', () => {
    const region1: Region = new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
    const region2: Region = new Region(RegionID.of(2), 'Albania', ISO3166.of('ALB'));
    const region3: Region = new Region(RegionID.of(1), 'Albania', ISO3166.of('ALB'));

    expect(region1.equals(region1)).toEqual(true);
    expect(region1.equals(region2)).toEqual(false);
    expect(region1.equals(region3)).toEqual(true);
  });

  it('copy', () => {
    const regionID: RegionID = RegionID.of(1);
    const name: string = 'Afghanistan';
    const iso3166: ISO3166 = ISO3166.of('AFG');

    const region: Region = new Region(regionID, name, iso3166);
    const copied: Region = region.copy();

    expect(copied.getRegionID()).toEqual(regionID);
    expect(copied.getName()).toEqual(name);
    expect(copied.getISO3166()).toEqual(iso3166);
  });

  it('toJSON', () => {
    const region: Region = new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));

    expect(region.toJSON()).toEqual({
      regionID: 1,
      name: 'Afghanistan',
      iso3166: 'AFG'
    });
  });
});
