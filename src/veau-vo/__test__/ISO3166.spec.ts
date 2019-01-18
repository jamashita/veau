import 'jest';
import {ISO3166} from '../ISO3166';

describe('ISO3166', () => {
  it('equals', () => {
    const iso31661: ISO3166 = ISO3166.of('AFG');
    const iso31662: ISO3166 = ISO3166.of('ALB');
    const iso31663: ISO3166 = ISO3166.of('AFG');

    expect(iso31661.equals(iso31661)).toEqual(true);
    expect(iso31661.equals(iso31662)).toEqual(false);
    expect(iso31661.equals(iso31663)).toEqual(true);
  });
});
