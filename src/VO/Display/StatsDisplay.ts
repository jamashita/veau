import { ValueObject } from '@jamashita/publikum-object';
import { Ambiguous, Nullable } from '@jamashita/publikum-type';

import { AsOf } from '../AsOf/AsOf';
import { AsOfs } from '../AsOf/AsOfs';
import { Column } from '../Coordinate/Column';
import { Row } from '../Coordinate/Row';
import { HeaderSize } from '../HeaderSize/HeaderSize';
import { Language } from '../Language/Language';
import { Region } from '../Region/Region';
import { StatsItemNames } from '../StatsItem/StatsItemNames';
import { StatsID } from '../StatsOutline/StatsID';
import { StatsName } from '../StatsOutline/StatsName';
import { StatsOutline } from '../StatsOutline/StatsOutline';
import { StatsUnit } from '../StatsOutline/StatsUnit';
import { UpdatedAt } from '../StatsOutline/UpdatedAt';
import { StatsValue } from '../StatsValue/StatsValue';
import { Term } from '../Term/Term';
import { StatsItemDisplay } from './StatsItemDisplay';
import { StatsItemDisplays } from 'src/VO/Display/StatsItemDisplays';

type Chart = Record<string, string | number>;

export class StatsDisplay extends ValueObject<StatsDisplay> {
  public readonly noun: 'Stats' = 'Stats';
  private readonly outline: StatsOutline;
  private readonly language: Language;
  private readonly region: Region;
  private readonly term: Term;
  private readonly items: StatsItemDisplays;
  private readonly startDate: AsOf;
  private readonly columns: AsOfs;
  private readonly headerSize: HeaderSize;

  public static of(
    outline: StatsOutline,
    language: Language,
    region: Region,
    term: Term,
    items: StatsItemDisplays,
    startDate: AsOf,
    columns: AsOfs,
    headerSize: HeaderSize
  ): StatsDisplay {
    return new StatsDisplay(outline, language, region, term, items, startDate, columns, headerSize);
  }

  protected constructor(
    outline: StatsOutline,
    language: Language,
    region: Region,
    term: Term,
    items: StatsItemDisplays,
    startDate: AsOf,
    columns: AsOfs,
    headerSize: HeaderSize
  ) {
    super();
    this.outline = outline;
    this.language = language;
    this.region = region;
    this.term = term;
    this.items = items;
    this.startDate = startDate;
    this.columns = columns;
    this.headerSize = headerSize;
  }

  public equals(other: StatsDisplay): boolean {
    if (this === other) {
      return true;
    }
    if (!this.outline.equals(other.outline)) {
      return false;
    }
    if (!this.language.equals(other.language)) {
      return false;
    }
    if (!this.region.equals(other.region)) {
      return false;
    }
    if (!this.term.equals(other.term)) {
      return false;
    }
    if (!this.items.equals(other.items)) {
      return false;
    }
    if (!this.startDate.equals(other.startDate)) {
      return false;
    }
    if (!this.startDate.equals(other.startDate)) {
      return false;
    }
    if (!this.columns.equals(other.columns)) {
      return false;
    }
    if (!this.headerSize.equals(other.headerSize)) {
      return false;
    }

    return true;
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.outline.toString());
    properties.push(this.language.toString());
    properties.push(this.region.toString());
    properties.push(this.term.toString());
    properties.push(this.items.toString());
    properties.push(this.startDate.toString());
    properties.push(this.columns.toString());
    properties.push(this.headerSize.toString());

    return properties.join(' ');
  }

  public getStatsID(): StatsID {
    return this.outline.getStatsID();
  }

  public getLanguage(): Language {
    return this.language;
  }

  public getRegion(): Region {
    return this.region;
  }

  public getTerm(): Term {
    return this.term;
  }

  public getName(): StatsName {
    return this.outline.getName();
  }

  public getUnit(): StatsUnit {
    return this.outline.getUnit();
  }

  public getUpdatedAt(): UpdatedAt {
    return this.outline.getUpdatedAt();
  }

  public getOutline(): StatsOutline {
    return this.outline;
  }

  public getItems(): StatsItemDisplays {
    return this.items;
  }

  public getStartDate(): AsOf {
    return this.startDate;
  }

  public getIdentifier(): StatsID {
    return this.outline.getStatsID();
  }

  public getRow(row: Row): Nullable<StatsItemDisplay> {
    return this.items.get(row.get());
  }

  public getColumns(): AsOfs {
    return this.columns;
  }

  public getColumn(column: Column): Nullable<AsOf> {
    return this.columns.get(column.get());
  }

  public getRowHeaders(): StatsItemNames {
    return this.items.getNames();
  }

  public getRowHeaderSize(): HeaderSize {
    return this.headerSize;
  }

  public getData(): Array<Array<string>> {
    return this.items.map<Array<string>>((item: StatsItemDisplay) => {
      return item.getValuesByColumn(this.getColumns()).row();
    });
  }

  public getChart(): Array<Record<string, string | number>> {
    const chartItems: Map<string, Chart> = new Map<string, Chart>();

    this.getColumns().forEach((column: AsOf) => {
      const asOfString: string = column.toString();

      chartItems.set(asOfString, {
        name: asOfString
      });
    });

    this.items.forEach((statsItem: StatsItemDisplay) => {
      statsItem.getValues().forEach((statsValue: StatsValue) => {
        const line: Ambiguous<Chart> = chartItems.get(statsValue.getAsOf().toString());

        if (line !== undefined) {
          line[statsItem.getName().get()] = statsValue.getValue().get();
        }
      });
    });

    const chart: Array<Chart> = [];

    chartItems.forEach((value: Chart) => {
      chart.push(value);
    });

    return chart;
  }

  public getItemNames(): StatsItemNames {
    return this.items.getNames();
  }

  public isDetermined(): boolean {
    return this.items.haveValues();
  }

  public isFilled(): boolean {
    if (this.language.isEmpty()) {
      return false;
    }
    if (this.region.isEmpty()) {
      return false;
    }
    if (this.outline.getName().isEmpty()) {
      return false;
    }
    if (this.outline.getUnit().isEmpty()) {
      return false;
    }

    return true;
  }

  public isValid(): boolean {
    if (!this.isFilled()) {
      return false;
    }
    if (!this.items.areFilled()) {
      return false;
    }

    return true;
  }
}
