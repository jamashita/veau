import { Alive, Dead, JSONable, Kind, Superposition, ValueObject } from 'publikum';

import { RegionIDError } from '../Region/Error/RegionIDError';
import { StatsIDError } from './Error/StatsIDError';
import { StatsOutlineError } from './Error/StatsOutlineError';
import { TermIDError } from '../Term/Error/TermIDError';
import { UpdatedAtError } from './Error/UpdatedAtError';
import { LanguageIDError } from '../Language/Error/LanguageIDError';
import { LanguageID } from '../Language/LanguageID';
import { RegionID } from '../Region/RegionID';
import { StatsID } from './StatsID';
import { StatsName } from './StatsName';
import { StatsUnit } from './StatsUnit';
import { Term } from '../Term/Term';
import { TermID } from '../Term/TermID';
import { UpdatedAt } from './UpdatedAt';

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

export class StatsOutline extends ValueObject implements JSONable {
  public readonly noun: 'StatsOutline' = 'StatsOutline';
  private readonly statsID: StatsID;
  private readonly languageID: LanguageID;
  private readonly regionID: RegionID;
  private readonly termID: TermID;
  private readonly name: StatsName;
  private readonly unit: StatsUnit;
  private readonly updatedAt: UpdatedAt;

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

  public static ofJSON(json: StatsOutlineJSON): Superposition<StatsOutline, StatsOutlineError> {
    return StatsID.ofString(json.statsID).match<StatsOutline, StatsOutlineError>(
      (statsID: StatsID) => {
        return LanguageID.ofString(json.languageID).match<StatsOutline, StatsOutlineError>(
          (languageID: LanguageID) => {
            return RegionID.ofString(json.regionID).match<StatsOutline, StatsOutlineError>(
              (regionID: RegionID) => {
                return TermID.ofString(json.termID).match<StatsOutline, StatsOutlineError>(
                  (termID: TermID) => {
                    return UpdatedAt.ofString(json.updatedAt).match<StatsOutline, StatsOutlineError>(
                      (updatedAt: UpdatedAt) => {
                        return Alive.of<StatsOutline, StatsOutlineError>(
                          StatsOutline.of(
                            statsID,
                            languageID,
                            regionID,
                            termID,
                            StatsName.of(json.name),
                            StatsUnit.of(json.unit),
                            updatedAt
                          )
                        );
                      },
                      (err: UpdatedAtError) => {
                        return Dead.of<StatsOutline, StatsOutlineError>(
                          new StatsOutlineError('StatsOutline.ofJSON()', err)
                        );
                      }
                    );
                  },
                  (err: TermIDError) => {
                    return Dead.of<StatsOutline, StatsOutlineError>(
                      new StatsOutlineError('StatsOutline.ofJSON()', err)
                    );
                  }
                );
              },
              (err: RegionIDError) => {
                return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofJSON()', err));
              }
            );
          },
          (err: LanguageIDError) => {
            return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofJSON()', err));
          }
        );
      },
      (err: StatsIDError) => {
        return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofJSON()', err));
      }
    );
  }

  public static ofRow(row: StatsOutlineRow): Superposition<StatsOutline, StatsOutlineError> {
    return StatsID.ofString(row.statsID).match<StatsOutline, StatsOutlineError>(
      (statsID: StatsID) => {
        return LanguageID.ofString(row.languageID).match<StatsOutline, StatsOutlineError>(
          (languageID: LanguageID) => {
            return RegionID.ofString(row.regionID).match<StatsOutline, StatsOutlineError>(
              (regionID: RegionID) => {
                return TermID.ofString(row.termID).match<StatsOutline, StatsOutlineError>(
                  (termID: TermID) => {
                    return UpdatedAt.ofString(row.updatedAt).match<StatsOutline, StatsOutlineError>(
                      (updatedAt: UpdatedAt) => {
                        return Alive.of<StatsOutline, StatsOutlineError>(
                          StatsOutline.of(
                            statsID,
                            languageID,
                            regionID,
                            termID,
                            StatsName.of(row.name),
                            StatsUnit.of(row.unit),
                            updatedAt
                          )
                        );
                      },
                      (err: UpdatedAtError) => {
                        return Dead.of<StatsOutline, StatsOutlineError>(
                          new StatsOutlineError('StatsOutline.ofRow()', err)
                        );
                      }
                    );
                  },
                  (err: TermIDError) => {
                    return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
                  }
                );
              },
              (err: RegionIDError) => {
                return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
              }
            );
          },
          (err: LanguageIDError) => {
            return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
          }
        );
      },
      (err: StatsIDError) => {
        return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
      }
    );
  }

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

  public static isJSON(n: unknown): n is StatsOutlineJSON {
    if (!Kind.isPlainObject(n)) {
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

  public getStatsID(): StatsID {
    return this.statsID;
  }

  public getLanguageID(): LanguageID {
    return this.languageID;
  }

  public getRegionID(): RegionID {
    return this.regionID;
  }

  public getTermID(): TermID {
    return this.termID;
  }

  public getName(): StatsName {
    return this.name;
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

  public equals(other: StatsOutline): boolean {
    if (this === other) {
      return true;
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

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.statsID.toString());
    properties.push(this.languageID.toString());
    properties.push(this.regionID.toString());
    properties.push(this.termID.toString());
    properties.push(this.name.toString());
    properties.push(this.unit.toString());
    properties.push(this.updatedAt.toString());

    return properties.join(' ');
  }
}