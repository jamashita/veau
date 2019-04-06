/* tslint:disable */
import 'jest';
import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { UUID } from '../../veau-vo/UUID';
import { StatsItems } from '../StatsItems';
import { StatsValues } from '../StatsValues';

describe('StatsItems', () => {
  it('move: first index', () => {
    const statsItem1: StatsItem = new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([]));
    const statsItem2: StatsItem = new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([]));
    const statsItem3: StatsItem = new StatsItem(StatsItemID.of(UUID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498')), 'stats item 3', new StatsValues([]));
    const statsItems: StatsItems = new StatsItems([statsItem1, statsItem2, statsItem3]);

    const moved: StatsItems = statsItems.move(0, 1);

    expect(moved.length()).toEqual(3);
    expect(moved.get(0)).toEqual(statsItem2);
    expect(moved.get(1)).toEqual(statsItem1);
    expect(moved.get(2)).toEqual(statsItem3);
  });

  it('move: middle index', () => {
    const statsItem1: StatsItem = new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([]));
    const statsItem2: StatsItem = new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([]));
    const statsItem3: StatsItem = new StatsItem(StatsItemID.of(UUID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498')), 'stats item 3', new StatsValues([]));
    const statsItems: StatsItems = new StatsItems([statsItem1, statsItem2, statsItem3]);

    const moved: StatsItems = statsItems.move(1, 2);

    expect(moved.length()).toEqual(3);
    expect(moved.get(0)).toEqual(statsItem1);
    expect(moved.get(1)).toEqual(statsItem3);
    expect(moved.get(2)).toEqual(statsItem2);
  });

  it('move: last index', () => {
    const statsItem1: StatsItem = new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([]));
    const statsItem2: StatsItem = new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([]));
    const statsItem3: StatsItem = new StatsItem(StatsItemID.of(UUID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498')), 'stats item 3', new StatsValues([]));
    const statsItems: StatsItems = new StatsItems([statsItem1, statsItem2, statsItem3]);

    const moved: StatsItems = statsItems.move(2, 0);

    expect(moved.length()).toEqual(3);
    expect(moved.get(0)).toEqual(statsItem3);
    expect(moved.get(1)).toEqual(statsItem2);
    expect(moved.get(2)).toEqual(statsItem1);
  });

  it('replace: first index', () => {
    const statsItems: StatsItems = new StatsItems( [
      new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([])),
      new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([])),
      new StatsItem(StatsItemID.of(UUID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498')), 'stats item 3', new StatsValues([]))
    ]);

    const statsItem: StatsItem = new StatsItem(StatsItemID.of(UUID.of('06023e5f-7908-4bce-9536-c64dc484756f')), 'new stats item', new StatsValues([]));

    const replaced: StatsItems = statsItems.replace(statsItem, 0);

    expect(replaced.length()).toEqual(3);
    expect(replaced.get(0)).toEqual(statsItem);
    expect(replaced.get(1)).not.toEqual(statsItem);
    expect(replaced.get(2)).not.toEqual(statsItem);
  });

  it('replace: middle index', () => {
    const statsItems: StatsItems = new StatsItems([
      new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([])),
      new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([])),
      new StatsItem(StatsItemID.of(UUID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498')), 'stats item 3', new StatsValues([]))
    ]);

    const statsItem: StatsItem = new StatsItem(StatsItemID.of(UUID.of('06023e5f-7908-4bce-9536-c64dc484756f')), 'new stats item', new StatsValues([]));

    const replaced: StatsItems = statsItems.replace(statsItem, 1);

    expect(replaced.length()).toEqual(3);
    expect(replaced.get(0)).not.toEqual(statsItem);
    expect(replaced.get(1)).toEqual(statsItem);
    expect(replaced.get(2)).not.toEqual(statsItem);
  });

  it('replace: last index', () => {
    const statsItems: StatsItems = new StatsItems([
      new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([])),
      new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([])),
      new StatsItem(StatsItemID.of(UUID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498')), 'stats item 3', new StatsValues([]))
    ]);

    const statsItem: StatsItem = new StatsItem(StatsItemID.of(UUID.of('06023e5f-7908-4bce-9536-c64dc484756f')), 'new stats item', new StatsValues([]));

    const replaced: StatsItems = statsItems.replace(statsItem, 2);

    expect(replaced.length()).toEqual(3);
    expect(replaced.get(0)).not.toEqual(statsItem);
    expect(replaced.get(1)).not.toEqual(statsItem);
    expect(replaced.get(2)).toEqual(statsItem);
  });

  it('remove', () => {
    const statsItem1: StatsItem = new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([]));
    const statsItem2: StatsItem = new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([]));
    const statsItem3: StatsItem = new StatsItem(StatsItemID.of(UUID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498')), 'stats item 3', new StatsValues([]));
    const statsItems: StatsItems = new StatsItems([
      statsItem1,
      statsItem2,
      statsItem3
    ]);

    const removed: StatsItems = statsItems.remove(statsItem1);

    expect(removed.length()).toEqual(2);
    expect(removed.get(0)).toEqual(statsItem2);
    expect(removed.get(1)).toEqual(statsItem3);
  });

  it('copy', () => {
    const statsItem1: StatsItem = new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([]));
    const statsItem2: StatsItem = new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([]));
    const statsItem3: StatsItem = new StatsItem(StatsItemID.of(UUID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498')), 'stats item 3', new StatsValues([]));
    const statsItems: StatsItems = new StatsItems([
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

  it('equals', () => {
    const statsItem1: StatsItem = new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([]));
    const statsItem2: StatsItem = new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([]));

    const statsItems1: StatsItems = new StatsItems([
      statsItem1,
      statsItem2
    ]);
    const statsItems2: StatsItems = new StatsItems([
      statsItem2
    ]);
    const statsItems3: StatsItems = new StatsItems([
      statsItem2,
      statsItem1
    ]);

    expect(statsItems1.equals(statsItems1)).toEqual(true);
    expect(statsItems1.equals(statsItems2)).toEqual(false);
    expect(statsItems1.equals(statsItems3)).toEqual(false);
  });
});
