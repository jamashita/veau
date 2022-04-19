import { ValueObject } from '@jamashita/anden-object';
import { JSONable, Kind } from '@jamashita/anden-type';
import { LanguageError } from '../Language/LanguageError.js';
import { LanguageID } from '../Language/LanguageID.js';
import { RegionError } from '../Region/RegionError.js';
import { RegionID } from '../Region/RegionID.js';
import { Term } from '../Term/Term.js';
import { TermError } from '../Term/TermError.js';
import { TermID } from '../Term/TermID.js';
import { StatsError } from './StatsError.js';
import { StatsID } from './StatsID.js';
import { StatsName } from './StatsName.js';
import { StatsOutlineError } from './StatsOutlineError.js';
import { StatsUnit } from './StatsUnit.js';
import { UpdatedAt } from './UpdatedAt.js';

export type StatsOutlineJSON = Readonly<{
  statsID: string;
  languageID: string;
  regionID: string;
  termID: string;
  name: string;
  unit: string;
  updatedAt: string;
}>;
export type StatsOutlineRow = Readonly<{
  statsID: string;
  languageID: string;
  regionID: string;
  termID: string;
  name: string;
  unit: string;
  updatedAt: string;
}>;

export class StatsOutline extends ValueObject implements JSONable<StatsOutlineJSON> {
  private readonly statsID: StatsID;
  private readonly languageID: LanguageID;
  private readonly regionID: RegionID;
  private readonly termID: TermID;
  private readonly name: StatsName;
  private readonly unit: StatsUnit;
  private readonly updatedAt: UpdatedAt;

  public static default(): StatsOutline {
    return StatsOutline.of(
      StatsID.generate(),
      LanguageID.empty(),
      RegionID.empty(),
      Term.DAILY.getTermID(),
      StatsName.empty(),
      StatsUnit.empty(),
      UpdatedAt.now()
    );
  }

  public static of(
    statsID: StatsID,
    languageID: LanguageID,
    regionID: RegionID,
    termID: TermID,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt
  ): StatsOutline {
    return new StatsOutline(statsID, languageID, regionID, termID, name, unit, updatedAt);
  }

  public static ofJSON(json: StatsOutlineJSON): StatsOutline {
    try {
      return StatsOutline.of(
        StatsID.ofString(json.statsID),
        LanguageID.ofString(json.languageID),
        RegionID.ofString(json.regionID),
        TermID.ofString(json.termID),
        StatsName.of(json.name),
        StatsUnit.of(json.unit),
        UpdatedAt.ofString(json.updatedAt)
      );
    }
    catch (err: unknown) {
      if (err instanceof StatsError || err instanceof LanguageError || err instanceof RegionError || err instanceof TermError) {
        throw new StatsOutlineError('StatsOutline.ofJSON()', err);
      }

      throw err;
    }
  }

  public static ofRow(row: StatsOutlineRow): StatsOutline {
    try {
      return StatsOutline.of(
        StatsID.ofString(row.statsID),
        LanguageID.ofString(row.languageID),
        RegionID.ofString(row.regionID),
        TermID.ofString(row.termID),
        StatsName.of(row.name),
        StatsUnit.of(row.unit),
        UpdatedAt.ofString(row.updatedAt)
      );
    }
    catch (err: unknown) {
      if (err instanceof StatsError || err instanceof LanguageError || err instanceof RegionError || err instanceof TermError) {
        throw new StatsOutlineError('StatsOutline.ofJSON()', err);
      }

      throw err;
    }
  }

  public static validate(n: unknown): n is StatsOutlineJSON {
    if (!Kind.isObject<StatsOutlineJSON>(n)) {
      return false;
    }
    if (!Kind.isString(n.statsID)) {
      return false;
    }
    if (!Kind.isString(n.languageID)) {
      return false;
    }
    if (!Kind.isString(n.regionID)) {
      return false;
    }
    if (!Kind.isString(n.termID)) {
      return false;
    }
    if (!Kind.isString(n.name)) {
      return false;
    }
    if (!Kind.isString(n.unit)) {
      return false;
    }
    if (!Kind.isString(n.updatedAt)) {
      return false;
    }

    return true;
  }

  protected constructor(
    statsID: StatsID,
    languageID: LanguageID,
    regionID: RegionID,
    termID: TermID,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt
  ) {
    super();
    this.statsID = statsID;
    this.languageID = languageID;
    this.regionID = regionID;
    this.termID = termID;
    this.name = name;
    this.unit = unit;
    this.updatedAt = updatedAt;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof StatsOutline)) {
      return false;
    }
    if (!this.statsID.equals(other.statsID)) {
      return false;
    }
    if (!this.languageID.equals(other.languageID)) {
      return false;
    }
    if (!this.regionID.equals(other.regionID)) {
      return false;
    }
    if (!this.termID.equals(other.termID)) {
      return false;
    }
    if (!this.name.equals(other.name)) {
      return false;
    }
    if (!this.unit.equals(other.unit)) {
      return false;
    }
    if (!this.updatedAt.equals(other.updatedAt)) {
      return false;
    }

    return true;
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.statsID.toString());
    properties.push(this.languageID.toString());
    properties.push(this.regionID.toString());
    properties.push(this.termID.toString());
    properties.push(this.name.toString());
    properties.push(this.unit.toString());
    properties.push(this.updatedAt.toString());

    return properties.join(', ');
  }

  public toJSON(): StatsOutlineJSON {
    return {
      statsID: this.statsID.get().get(),
      languageID: this.languageID.get().get(),
      regionID: this.regionID.get().get(),
      termID: this.termID.get().get(),
      name: this.name.get(),
      unit: this.unit.get(),
      updatedAt: this.updatedAt.toString()
    };
  }

  public getLanguageID(): LanguageID {
    return this.languageID;
  }

  public getName(): StatsName {
    return this.name;
  }

  public getRegionID(): RegionID {
    return this.regionID;
  }

  public getStatsID(): StatsID {
    return this.statsID;
  }

  public getTermID(): TermID {
    return this.termID;
  }

  public getUnit(): StatsUnit {
    return this.unit;
  }

  public getUpdatedAt(): UpdatedAt {
    return this.updatedAt;
  }

  public isFilled(): boolean {
    if (this.languageID.equals(LanguageID.empty())) {
      return false;
    }
    if (this.regionID.equals(RegionID.empty())) {
      return false;
    }
    if (this.name.equals(StatsName.empty())) {
      return false;
    }
    if (this.unit.equals(StatsUnit.empty())) {
      return false;
    }

    return true;
  }
}
