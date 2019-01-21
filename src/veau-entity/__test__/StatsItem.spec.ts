/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { UUID } from '../../veau-vo/UUID';
import { StatsItem } from '../StatsItem';

describe('StatsItem', () => {
  it('equals', () => {
    const statsItemID1: StatsItemID = StatsItemID.of(UUID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0'));
    const statsItemID2: StatsItemID = StatsItemID.of(UUID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4'));
    const statsItem1: StatsItem = new StatsItem(statsItemID1, 'name 1', 'unit 1', 1, []);
    const statsItem2: StatsItem = new StatsItem(statsItemID2, 'name 1', 'unit 1', 1, []);
    const statsItem3: StatsItem = new StatsItem(statsItemID1, 'name 3', 'unit 3', 2, [StatsValue.of(moment('2000-01-01'), 10)]);

    expect(statsItem1.equals(statsItem1)).toEqual(true);
    expect(statsItem1.equals(statsItem2)).toEqual(false);
    expect(statsItem1.equals(statsItem3)).toEqual(true);
  });

  it('toJSON', () => {
    const statsItemID: StatsItemID = StatsItemID.of(UUID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4'));
    const statsItem: StatsItem = new StatsItem(statsItemID, 'name 1', 'unit 1', 1, [StatsValue.of(moment('2000-01-01'), 10)]);

    expect(statsItem.toJSON()).toEqual({
      statsItemID: 'b5f208c3-f171-488f-a8dc-f3798db5f9f4',
      name: 'name 1',
      unit: 'unit 1',
      seq: 1,
      values: [
        {
          asOf: '2000-01-01',
          value: 10
        }
      ]
    });
  });
});
