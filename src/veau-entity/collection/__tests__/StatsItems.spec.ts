import 'jest';
import * as moment from 'moment';
import { StatsValues } from '../../../veau-vo/collection/StatsValues';
import { StatsItemID } from '../../../veau-vo/StatsItemID';
import { StatsItemName } from '../../../veau-vo/StatsItemName';
import { StatsValue } from '../../../veau-vo/StatsValue';
import { StatsItem, StatsItemJSON } from '../../StatsItem';
import { StatsItems } from '../StatsItems';

describe('StatsItems', () => {
  describe('move', () => {
    it('first index', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(0, 1);

      expect(moved.length()).toEqual(3);
      expect(moved.get(0)).toEqual(statsItem2);
      expect(moved.get(1)).toEqual(statsItem1);
      expect(moved.get(2)).toEqual(statsItem3);
    });

    it('middle index', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(1, 2);

      expect(moved.length()).toEqual(3);
      expect(moved.get(0)).toEqual(statsItem1);
      expect(moved.get(1)).toEqual(statsItem3);
      expect(moved.get(2)).toEqual(statsItem2);
    });

    it('last index', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(2, 0);

      expect(moved.length()).toEqual(3);
      expect(moved.get(0)).toEqual(statsItem3);
      expect(moved.get(1)).toEqual(statsItem2);
      expect(moved.get(2)).toEqual(statsItem1);
    });
  });

  describe('replace', () => {
    it('first index', () => {
      const statsItems: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]))
      ]);

      const statsItem: StatsItem = StatsItem.from(StatsItemID.of('06023e5f-7908-4bce-9536-c64dc484756f'), StatsItemName.of('new stats item'), StatsValues.of([]));

      const replaced: StatsItems = statsItems.replace(statsItem, 0);

      expect(replaced.length()).toEqual(3);
      expect(replaced.get(0)).toEqual(statsItem);
      expect(replaced.get(1)).not.toEqual(statsItem);
      expect(replaced.get(2)).not.toEqual(statsItem);
    });

    it('middle index', () => {
      const statsItems: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]))
      ]);

      const statsItem: StatsItem = StatsItem.from(StatsItemID.of('06023e5f-7908-4bce-9536-c64dc484756f'), StatsItemName.of('new stats item'), StatsValues.of([]));

      const replaced: StatsItems = statsItems.replace(statsItem, 1);

      expect(replaced.length()).toEqual(3);
      expect(replaced.get(0)).not.toEqual(statsItem);
      expect(replaced.get(1)).toEqual(statsItem);
      expect(replaced.get(2)).not.toEqual(statsItem);
    });

    it('last index', () => {
      const statsItems: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]))
      ]);

      const statsItem: StatsItem = StatsItem.from(StatsItemID.of('06023e5f-7908-4bce-9536-c64dc484756f'), StatsItemName.of('new stats item'), StatsValues.of([]));

      const replaced: StatsItems = statsItems.replace(statsItem, 2);

      expect(replaced.length()).toEqual(3);
      expect(replaced.get(0)).not.toEqual(statsItem);
      expect(replaced.get(1)).not.toEqual(statsItem);
      expect(replaced.get(2)).toEqual(statsItem);
    });
  });

  describe('removeItem', () => {
    it('correctly removed the same object', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const removed: StatsItems = statsItems.remove(statsItem1);

      expect(removed.length()).toEqual(2);
      expect(removed.get(0)).toEqual(statsItem2);
      expect(removed.get(1)).toEqual(statsItem3);
    });
  });

  describe('areFilled', () => {
    it('returns true if the all items are filled', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.default(), StatsValues.of([]));
      const statsItems1: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        statsItem2,
        statsItem3
      ]);

      expect(statsItems1.areFilled()).toEqual(true);
      expect(statsItems2.areFilled()).toEqual(false);
    });
  });

  describe('areValid', () => {
    it('returns true if the all items are valid', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.default(), StatsValues.of([]));
      const statsItems1: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        statsItem2,
        statsItem3
      ]);

      expect(statsItems1.areValid()).toEqual(true);
      expect(statsItems2.areValid()).toEqual(false);
    });
  });

  describe('haveValues', () => {
    it('no items', () => {
      const statsItems: StatsItems = StatsItems.from([
      ]);

      expect(statsItems.haveValues()).toEqual(false);
    });

    it('no values', () => {
      const statsItems1: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06'), StatsItemName.of('item1'), StatsValues.of([
        ]))
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('c9aa6bc7-2f38-49e0-8f5e-a650a43e8885'), StatsItemName.of('item1'), StatsValues.of([
        ])),
        StatsItem.from(StatsItemID.of('67379875-06e6-47be-8faf-945e93aa47cf'), StatsItemName.of('item1'), StatsValues.of([
        ]))
      ]);

      expect(statsItems1.haveValues()).toEqual(false);
      expect(statsItems2.haveValues()).toEqual(false);
    });

    it('have values', () => {
      const statsItems: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06'), StatsItemName.of('item1'), StatsValues.of([
          StatsValue.of(moment('2000-01-01'), 1)
        ]))
      ]);

      expect(statsItems.haveValues()).toEqual(true);
    });
  });

  describe('copy', () => {
    it('deeply copied', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const copied: StatsItems = statsItems.copy();

      expect(statsItems).not.toBe(copied);
      expect(copied.get(0)).toEqual(statsItem1);
      expect(copied.get(1)).toEqual(statsItem2);
      expect(copied.get(2)).toEqual(statsItem3);
    });
  });

  describe('equals', () => {
    it('returns true if the elements and their order are same', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));

      const statsItems1: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        statsItem2
      ]);
      const statsItems3: StatsItems = StatsItems.from([
        statsItem2,
        statsItem1
      ]);
      const statsItems4: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);

      expect(statsItems1.equals(statsItems1)).toEqual(true);
      expect(statsItems1.equals(statsItems2)).toEqual(false);
      expect(statsItems1.equals(statsItems3)).toEqual(false);
      expect(statsItems1.equals(statsItems4)).toEqual(true);
    });
  });

  describe('areSame', () => {
    it('returns true if all the properties are the same', () => {
      const statsItems1: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]))
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]))
      ]);
      const statsItems3: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]))
      ]);
      const statsItems4: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]))
      ]);
      const statsItems5: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]))
      ]);
      const statsItems6: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 3'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]))
      ]);
      const statsItems7: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 4'), StatsValues.of([]))
      ]);
      const statsItems8: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([StatsValue.of(moment('2000-01-01'), 1)])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]))
      ]);
      const statsItems9: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([StatsValue.of(moment('2000-01-01'), 1)]))
      ]);
      const statsItems10: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([StatsValue.of(moment('2000-01-01'), 1)])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([StatsValue.of(moment('2000-01-01'), 1)]))
      ]);

      expect(statsItems1.areSame(statsItems1)).toEqual(true);
      expect(statsItems1.areSame(statsItems2)).toEqual(false);
      expect(statsItems1.areSame(statsItems3)).toEqual(false);
      expect(statsItems1.areSame(statsItems4)).toEqual(false);
      expect(statsItems1.areSame(statsItems5)).toEqual(true);
      expect(statsItems1.areSame(statsItems6)).toEqual(false);
      expect(statsItems1.areSame(statsItems7)).toEqual(false);
      expect(statsItems1.areSame(statsItems8)).toEqual(false);
      expect(statsItems1.areSame(statsItems9)).toEqual(false);
      expect(statsItems1.areSame(statsItems10)).toEqual(false);
    });
  });

  describe('fromJSON', () => {
    it('normal case', () => {
      const json: Array<StatsItemJSON> = [
        {
          statsItemID: 'item id 1',
          name: 'stats name 1',
          values: []
        },
        {
          statsItemID: 'item id 2',
          name: 'stats name 2',
          values: []
        }
      ];

      const items: StatsItems = StatsItems.fromJSON(json);

      expect(items.length()).toEqual(2);
      expect(items.get(0).getStatsItemID().get()).toEqual(json[0].statsItemID);
      expect(items.get(0).getName().get()).toEqual(json[0].name);
      expect(items.get(1).getStatsItemID().get()).toEqual(json[1].statsItemID);
      expect(items.get(1).getName().get()).toEqual(json[1].name);
    });
  });
});
