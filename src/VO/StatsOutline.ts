import { StatsIDError } from '../Error/StatsIDError';
import { StatsOutlineError } from '../Error/StatsOutlineError';
import { TermError } from '../Error/TermError';
import { UpdatedAtError } from '../Error/UpdatedAtError';
import { Cloneable } from '../General/Interface/Cloneable';
import { JSONable } from '../General/Interface/JSONable';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { ValueObject } from '../General/ValueObject';
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

export class StatsOutline extends ValueObject implements JSONable, Cloneable {
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
    return new StatsOutline(statsID, language, region, term, name, unit, updatedAt);
  }

  public static ofJSON(json: StatsOutlineJSON): Try<StatsOutline, StatsOutlineError> {
    return StatsID.ofString(json.statsID).match<Try<StatsOutline, StatsOutlineError>>((statsID: StatsID) => {
      return Term.of(json.termID).match<Try<StatsOutline, StatsOutlineError>>((term: Term) => {
        return UpdatedAt.ofString(json.updatedAt).match<Try<StatsOutline, StatsOutlineError>>((updatedAt: UpdatedAt) => {
          return Success.of<StatsOutline, StatsOutlineError>(StatsOutline.of(
            statsID,
            Language.ofJSON(json.language),
            Region.ofJSON(json.region),
            term,
            StatsName.of(json.name),
            StatsUnit.of(json.unit),
            updatedAt
          ));
        }, (err: UpdatedAtError) => {
          return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError(err.message));
        });
      }, (err: TermError) => {
        return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError(err.message));
      });
    }, (err: StatsIDError) => {
      return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError(err.message));
    });
  }

  public static ofRow(row: StatsOutlineRow): Try<StatsOutline, StatsOutlineError> {
    return StatsID.ofString(row.statsID).match<Try<StatsOutline, StatsOutlineError>>((statsID: StatsID) => {
      return Term.of(row.termID).match<Try<StatsOutline, StatsOutlineError>>((term: Term) => {
        return UpdatedAt.ofString(row.updatedAt).match<Try<StatsOutline, StatsOutlineError>>((updatedAt: UpdatedAt) => {
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
          return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError(err.message));
        });
      }, (err: TermError) => {
        return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError(err.message));
      });
    }, (err: StatsIDError) => {
      return Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError(err.message));
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
    const {
      language,
      region,
      name,
      unit
    } = this;

    if (language.equals(Language.empty())) {
      return false;
    }
    if (region.equals(Region.default())) {
      return false;
    }
    if (name.equals(StatsName.default())) {
      return false;
    }
    if (unit.equals(StatsUnit.default())) {
      return false;
    }

    return true;
  }

  public equals(other: StatsOutline): boolean {
    if (this === other) {
      return true;
    }

    const {
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt
    } = this;

    if (!statsID.equals(other.statsID)) {
      return false;
    }
    if (!language.equals(other.language)) {
      return false;
    }
    if (!region.equals(other.region)) {
      return false;
    }
    if (!term.equals(other.term)) {
      return false;
    }
    if (!name.equals(other.name)) {
      return false;
    }
    if (!unit.equals(other.unit)) {
      return false;
    }
    if (!updatedAt.equals(other.updatedAt)) {
      return false;
    }

    return true;
  }

  public copy(): StatsOutline {
    const {
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt
    } = this;

    return new StatsOutline(statsID, language, region, term, name, unit, updatedAt);
  }

  public toJSON(): StatsOutlineJSON {
    const {
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt
    } = this;

    return {
      statsID: statsID.get().get(),
      language: language.toJSON(),
      region: region.toJSON(),
      termID: term.getID(),
      name: name.get(),
      unit: unit.get(),
      updatedAt: updatedAt.toString()
    };
  }

  public toString(): string {
    const {
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt
    } = this;

    return `${statsID.toString()} ${language.toString()} ${region.toString()} ${term.toString()} ${name.get()} ${unit.toString()} ${updatedAt.toString()}`;
  }
}
