import { StatsIDError } from '../veau-error/StatsIDError';
import { StatsOutlineError } from '../veau-error/StatsOutlineError';
import { TermError } from '../veau-error/TermError';
import { UpdatedAtError } from '../veau-error/UpdatedAtError';
import { Cloneable } from '../veau-general/Cloneable';
import { JSONable } from '../veau-general/JSONable';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { ValueObject } from '../veau-general/ValueObject';
import { ISO3166 } from './ISO3166';
import { ISO639 } from './ISO639';
import { Language, LanguageJSON } from './Language';
import { LanguageID } from './LanguageID';
import { LanguageName } from './LanguageName';
import { Region, RegionJSON } from './Region';
import { RegionID } from './RegionID';
import { RegionName } from './RegionName';
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

  public static of(statsID: StatsID, language: Language, region: Region, term: Term, name: StatsName, unit: StatsUnit, updatedAt: UpdatedAt): StatsOutline {
    return new StatsOutline(statsID, language, region, term, name, unit, updatedAt);
  }

  public static ofJSON(json: StatsOutlineJSON): Try<StatsOutline, StatsOutlineError> {
    const {
      statsID,
      language,
      region,
      termID,
      name,
      unit,
      updatedAt
    } = json;

    return StatsID.ofString(statsID).match<Try<StatsOutline, StatsOutlineError>>((id: StatsID) => {
      return Term.of(termID).match<Try<StatsOutline, StatsOutlineError>>((term: Term) => {
        return UpdatedAt.ofString(updatedAt).match<Try<StatsOutline, StatsOutlineError>>((at: UpdatedAt) => {
          return Success.of<StatsOutline, StatsOutlineError>(StatsOutline.of(
            id,
            Language.ofJSON(language),
            Region.ofJSON(region),
            term,
            StatsName.of(name),
            StatsUnit.of(unit),
            at
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
    const {
      statsID,
      languageID,
      languageName,
      languageEnglishName,
      iso639,
      regionID,
      regionName,
      iso3166,
      termID,
      name,
      unit,
      updatedAt
    } = row;

    const language: Language = Language.of(LanguageID.of(languageID), LanguageName.of(languageName), LanguageName.of(languageEnglishName), ISO639.of(iso639));
    const region: Region = Region.of(RegionID.of(regionID), RegionName.of(regionName), ISO3166.of(iso3166));

    return StatsID.ofString(statsID).match<Try<StatsOutline, StatsOutlineError>>((id: StatsID) => {
      return Term.of(termID).match<Try<StatsOutline, StatsOutlineError>>((term: Term) => {
        return UpdatedAt.ofString(updatedAt).match<Try<StatsOutline, StatsOutlineError>>((at: UpdatedAt) => {
          return Success.of<StatsOutline, StatsOutlineError>(StatsOutline.of(
            id,
            language,
            region,
            term,
            StatsName.of(name),
            StatsUnit.of(unit),
            at
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

  private constructor(statsID: StatsID, language: Language, region: Region, term: Term, name: StatsName, unit: StatsUnit, updatedAt: UpdatedAt) {
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

    if (language.equals(Language.default())) {
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
    if (!language.equals(other.getLanguage())) {
      return false;
    }
    if (!region.equals(other.getRegion())) {
      return false;
    }
    if (term !== other.getTerm()) {
      return false;
    }
    if (!name.equals(other.getName())) {
      return false;
    }
    if (!unit.equals(other.getUnit())) {
      return false;
    }
    if (!updatedAt.equals(other.getUpdatedAt())) {
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
