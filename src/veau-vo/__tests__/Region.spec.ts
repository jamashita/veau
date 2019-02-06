/* tslint:disable */
import 'jest';
import { ISO3166 } from '../ISO3166';
import { Region } from '../Region';
import { RegionID } from '../RegionID';

describe('Region', () => {
  it('equals', () => {
    const region1: Region = Region.of(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
    const region2: Region = Region.of(RegionID.of(2), 'Albania', ISO3166.of('ALB'));
    const region3: Region = Region.of(RegionID.of(1), 'Albania', ISO3166.of('ALB'));

    expect(region1.equals(region1)).toEqual(true);
    expect(region1.equals(region2)).toEqual(false);
    expect(region1.equals(region3)).toEqual(true);
  });

  it('toJSON', () => {
    const region: Region = Region.of(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));

    expect(region.toJSON()).toEqual({
      regionID: 1,
      name: 'Afghanistan',
      iso3166: 'AFG'
    });
  });
});
