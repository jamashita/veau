import { ValueObject } from 'publikum';
import { StatsIDError } from '../Error/StatsIDError';
import { StatsOutlineError } from '../Error/StatsOutlineError';
import { TermError } from '../Error/TermError';
import { UpdatedAtError } from '../Error/UpdatedAtError';
import { Cloneable } from '../General/Interface/Cloneable';
import { JSONable } from '../General/Interface/JSONable';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { Language, LanguageJSON } from './Language';
import { Region, RegionJSON } from './Region';
import { StatsID } from './StatsID';
import { StatsName } from './StatsName';
import { StatsUnit } from './StatsUnit';
import { Term } from './Term';
import { UpdatedAt } from './UpdatedAt';

export type StatsOutlineJSON = Readonly<{
  statsID: string;
  language: LanguageJSON;
  region: RegionJSON;
  termID: number;
  name: string;
  unit: string;
  updatedAt: string;
}>;
export type StatsOutlineRow = Readonly<{
  statsID: string;
  languageID: number;
  languageName: string;
  languageEnglishName: string;
  iso639: string;
  regionID: number;
  regionName: string;
  iso3166: string;
  termID: number;
  name: string;
  unit: string;
  updatedAt: string;
}>;

export class StatsOutline extends ValueObject implements Cloneable<StatsOutline>, JSONable {
  public readonly noun: 'StatsOutline' = 'StatsOutline';
  private readonly statsID: StatsID;
  private readonly language: Language;
  private readonly region: Region;
  private readonly term: Term;
  private readonly name: StatsName;
  private readonly unit: StatsUnit;
  private readonly updatedAt: UpdatedAt;

  public static of(
    statsID: StatsID,
    language: Language,
    region: Region,
    term: Term,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt
  ): StatsOutline {
    return new StatsOutline(
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt
    );
  }

  public static ofJSON(json: StatsOutlineJSON): Superposition<StatsOutline, StatsOutlineError> {
    return StatsID.ofString(json.statsID).match<StatsOutline, StatsOutlineError>((statsID: StatsID) => {
      return Term.of(json.termID).match<StatsOutline, StatsOutlineError>((term: Term) => {
        return UpdatedAt.ofString(json.updatedAt).match<StatsOutline, StatsOutlineError>((updatedAt: UpdatedAt) => {
          return Success.of<StatsOutline, StatsOutlineError>(
            StatsOutline.of(
              statsID,
              Language.ofJSON(json.language),
              Region.ofJSON(json.region),
              term,
              StatsName.of(json.name),
              StatsUnit.of(json.unit),
              updatedAt
            )
          );
        }, (err: UpdatedAtError) => {
          return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofJSON()', err));
        });
      }, (err: TermError) => {
        return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofJSON()', err));
      });
    }, (err: StatsIDError) => {
      return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofJSON()', err));
    });
  }

  public static ofRow(row: StatsOutlineRow): Superposition<StatsOutline, StatsOutlineError> {
    return StatsID.ofString(row.statsID).match<StatsOutline, StatsOutlineError>((statsID: StatsID) => {
      return Term.of(row.termID).match<StatsOutline, StatsOutlineError>((term: Term) => {
        return UpdatedAt.ofString(row.updatedAt).match<StatsOutline, StatsOutlineError>((updatedAt: UpdatedAt) => {
          const language: Language = Language.ofRow({
            languageID: row.languageID,
            name: row.languageName,
            englishName: row.languageEnglishName,
            iso639: row.iso639
          });
          const region: Region = Region.ofRow({
            regionID: row.regionID,
            name: row.regionName,
            iso3166: row.iso3166
          });

          return Success.of<StatsOutline, StatsOutlineError>(
            StatsOutline.of(
              statsID,
              language,
              region,
              term,
              StatsName.of(row.name),
              StatsUnit.of(row.unit),
              updatedAt
            )
          );
        }, (err: UpdatedAtError) => {
          return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
        });
      }, (err: TermError) => {
        return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
      });
    }, (err: StatsIDError) => {
      return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('StatsOutline.ofRow()', err));
    });
  }

  protected constructor(
    statsID: StatsID,
    language: Language,
    region: Region,
    term: Term,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt
  ) {
    super();
    this.statsID = statsID;
    this.language = language;
    this.region = region;
    this.term = term;
    this.name = name;
    this.unit = unit;
    this.updatedAt = updatedAt;
  }

  public getStatsID(): StatsID {
    return this.statsID;
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
    return this.name;
  }

  public getUnit(): StatsUnit {
    return this.unit;
  }

  public getUpdatedAt(): UpdatedAt {
    return this.updatedAt;
  }

  public isFilled(): boolean {
    if (this.language.equals(Language.empty())) {
      return false;
    }
    if (this.region.equals(Region.empty())) {
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
    if (!this.language.equals(other.language)) {
      return false;
    }
    if (!this.region.equals(other.region)) {
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
      this.language,
      this.region,
      this.term,
      this.name,
      this.unit,
      this.updatedAt
    );
  }

  public toJSON(): StatsOutlineJSON {
    return {
      statsID: this.statsID.get().get(),
      language: this.language.toJSON(),
      region: this.region.toJSON(),
      termID: this.term.getID(),
      name: this.name.get(),
      unit: this.unit.get(),
      updatedAt: this.updatedAt.toString()
    };
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.statsID.toString());
    properties.push(this.language.toString());
    properties.push(this.region.toString());
    properties.push(this.term.toString());
    properties.push(this.name.toString());
    properties.push(this.unit.toString());
    properties.push(this.updatedAt.toString());

    return properties.join(' ');
  }
}
