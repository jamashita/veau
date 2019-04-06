import { StatsItem, StatsItemJSON } from '../veau-entity/StatsItem';
import { NoSuchElementError } from '../veau-general/Error/NoSuchElementError';

export class StatsItems {
  private items: Array<StatsItem>;

  public constructor(items: Array<StatsItem>) {
    this.items = items;
  }

  public get(index: number): StatsItem {
    const statsItem: StatsItem | undefined = this.items[index];

    if (statsItem === undefined) {
      throw new NoSuchElementError(`${index} DOES NOT EXIST`);
    }

    return statsItem;
  }

  public move(from: number, to: number): StatsItems {
    const min: number = Math.min(from, to);
    const max: number = Math.max(from, to);

    const items: Array<StatsItem> = [
      ...this.items.slice(0, min),
      this.items[max],
      ...this.items.slice(min + 1, max),
      this.items[min],
      ...this.items.slice(max + 1)
    ];

    return new StatsItems(items);
  }

  public replace(statsItem: StatsItem, to: number): StatsItems {
    const items: Array<StatsItem> = [
      ...this.items.slice(0, to),
      statsItem,
      ...this.items.slice(to + 1)
    ];

    return new StatsItems(items);
  }

  public remove(statsItem: StatsItem): StatsItems {
    const items: Array<StatsItem> = this.items.filter((item: StatsItem) => {
      if (item.equals(statsItem)) {
        return false;
      }

      return true;
    });

    return new StatsItems(items);
  }

  public length(): number {
    return this.items.length;
  }

  public forEach(predicate: (statsItem: StatsItem) => void): void {
    this.items.forEach(predicate);
  }

  public copy(): StatsItems {
    const items: Array<StatsItem> = [];

    this.items.forEach((statsItem: StatsItem) => {
      items.push(statsItem);
    });

    return new StatsItems(items);
  }

  public equals(other: StatsItems): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.items.length;

    if (length !== other.length()) {
      return false;
    }
    for (let i: number = 0; i < length; i++) {
      if (!this.items[i].equals(other.get(i))) {
        return false;
      }
    }

    return true;
  }

  public toJSON(): Array<StatsItemJSON> {
    return this.items.map<StatsItemJSON>((item: StatsItem) => {
      return item.toJSON();
    });
  }
}
