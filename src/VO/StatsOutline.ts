import { Alive, Cloneable, Dead, JSONable, Superposition, ValueObject } from 'publikum';
import { LanguageIDError } from '../Error/LanguageIDError';
import { RegionIDError } from '../Error/RegionIDError';
import { StatsIDError } from '../Error/StatsIDError';
import { StatsOutlineError } from '../Error/StatsOutlineError';
import { TermError } from '../Error/TermError';
import { UpdatedAtError } from '../Error/UpdatedAtError';
import { LanguageID } from './LanguageID';
import { RegionID } from './RegionID';
import { StatsID } from './StatsID';
import { StatsName } from './StatsName';
import { StatsUnit } from './StatsUnit';
import { Term } from './Term';
import { UpdatedAt } from './UpdatedAt';

export type StatsOutlineJSON = Readonly<{
  statsID: string;
  languageID: string;
  regionID: string;
  termID: number;
  name: string;
  unit: string;
  updatedAt: string;
}>;
export type StatsOutlineRow = Readonly<{
  statsID: string;
  languageID: string;
  regionID: string;
  termID: number;
  name: string;
  unit: string;
  updatedAt: string;
}>;

export class StatsOutline extends ValueObject implements Cloneable<StatsOutline>, JSONable {
  public readonly noun: 'StatsOutline' = 'StatsOutline';
  private readonly statsID: StatsID;
  private readonly languageID: LanguageID;
  private readonly regionID: RegionID;
  private readonly term: Term;
  private readonly name: StatsName;
  private readonly unit: StatsUnit;
  private readonly updatedAt: UpdatedAt;

  public static of(
    statsID: StatsID,
    languageID: LanguageID,
    regionID: RegionID,
    term: Term,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt
  ): StatsOutline {
    return new StatsOutline(
      statsID,
      languageID,
      regionID,
      term,
      name,
      unit,
      updatedAt
    );
  }

  public static ofJSON(json: StatsOutlineJSON): Superposition<StatsOutline, StatsOutlineError> {
    return StatsID.ofString(json.statsID).match<StatsOutline, StatsOutlineError>((statsID: StatsID) => {
      return LanguageID.ofString(json.languageID).match<StatsOutline, StatsOutlineError>((languageID: LanguageID) => {
        return RegionID.ofString(json.regionID).match<StatsOutline, StatsOutlineError>((regionID: RegionID) => {
          return Term.of(json.termID).match<StatsOutline, StatsOutlineError>((term: Term) => {
            return UpdatedAt.ofString(json.updatedAt).match<StatsOutline, StatsOutlineError>((updatedAt: UpdatedAt) => {
              return Alive.of<StatsOutline, StatsOutlineError>(
                StatsOutline.of(
                  statsID,
                  languageID,
                  regionID,
                  term,
                  StatsName.of(json.name),
                  StatsUnit.of(json.unit),
                  updatedAt
                )
              );
            }, (err: UpdatedAtError) => {
              return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofJSON()', err));
            });
          }, (err: TermError) => {
            return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofJSON()', err));
          });
        }, (err: RegionIDError) => {
          return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofJSON()', err));
        });
      }, (err: LanguageIDError) => {
        return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofJSON()', err));
      });
    }, (err: StatsIDError) => {
      return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofJSON()', err));
    });
  }

  public static ofRow(row: StatsOutlineRow): Superposition<StatsOutline, StatsOutlineError> {
    return StatsID.ofString(row.statsID).match<StatsOutline, StatsOutlineError>((statsID: StatsID) => {
      return LanguageID.ofString(row.languageID).match<StatsOutline, StatsOutlineError>((languageID: LanguageID) => {
        return RegionID.ofString(row.regionID).match<StatsOutline, StatsOutlineError>((regionID: RegionID) => {
          return Term.of(row.termID).match<StatsOutline, StatsOutlineError>((term: Term) => {
            return UpdatedAt.ofString(row.updatedAt).match<StatsOutline, StatsOutlineError>((updatedAt: UpdatedAt) => {
              return Alive.of<StatsOutline, StatsOutlineError>(
                StatsOutline.of(
                  statsID,
                  languageID,
                  regionID,
                  term,
                  StatsName.of(row.name),
                  StatsUnit.of(row.unit),
                  updatedAt
                )
              );
            }, (err: UpdatedAtError) => {
              return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
            });
          }, (err: TermError) => {
            return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
          });
        }, (err: RegionIDError) => {
          return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
        });
      }, (err: LanguageIDError) => {
        return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
      });
    }, (err: StatsIDError) => {
      return Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
    });
  }

  protected constructor(
    statsID: StatsID,
    languageID: LanguageID,
    regionID: RegionID,
    term: Term,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt
  ) {
    super();
    this.statsID = statsID;
    this.languageID = languageID;
    this.regionID = regionID;
    this.term = term;
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

  public getTerm(): Term {
    return this.term;
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
    if (!this.term.equals(other.term)) {
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

  public duplicate(): StatsOutline {
    return new StatsOutline(
      this.statsID,
      this.languageID,
      this.regionID,
      this.term,
      this.name,
      this.unit,
      this.updatedAt
    );
  }

  public toJSON(): StatsOutlineJSON {
    return {
      statsID: this.statsID.get().get(),
      languageID: this.languageID.get().get(),
      regionID: this.regionID.get().get(),
      termID: this.term.getID(),
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
    properties.push(this.term.toString());
    properties.push(this.name.toString());
    properties.push(this.unit.toString());
    properties.push(this.updatedAt.toString());

    return properties.join(' ');
  }
}
