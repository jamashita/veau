/* tslint:disable */
import 'jest';
import { StatsItem } from '../StatsItem';

describe('StatsItem', () => {
  it('equals', () => {
    const statsItem1: StatsItem = StatsItem.of('2000-01-01', 0);
    const statsItem2: StatsItem = StatsItem.of('2000-01-02', 0);
    const statsItem3: StatsItem = StatsItem.of('2000-01-01', 0);
    const statsItem4: StatsItem = StatsItem.of('2000-01-01', -1);
    const statsItem5: StatsItem = StatsItem.of('2000-01-01', 1);

    expect(statsItem1.equals(statsItem1)).toEqual(true);
    expect(statsItem1.equals(statsItem2)).toEqual(false);
    expect(statsItem1.equals(statsItem3)).toEqual(true);
    expect(statsItem1.equals(statsItem4)).toEqual(false);
    expect(statsItem1.equals(statsItem5)).toEqual(false);
  });

  it('toJSON', () => {
    const statsItem: StatsItem = StatsItem.of('2000-01-01', 1);

    expect(statsItem.toJSON()).toEqual({
      asOf: '2000-01-01',
      value: 1
    });
  });
});
