import { Term } from '../veau-enum/Term';
import { JSONable } from '../veau-general/JSONable';
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
import { UpdatedAt } from './UpdatedAt';
import { ValueObject } from './ValueObject';

export type StatsOutlineJSON = {
  statsID: string;
  language: LanguageJSON;
  region: RegionJSON;
  termID: number;
  name: string;
  unit: string;
  updatedAt: string;
};

export type StatsOutlineRow = {
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
};

export class StatsOutline extends ValueObject implements JSONable {
  private statsID: StatsID;
  private language: Language;
  private region: Region;
  private term: Term;
  private name: StatsName;
  private unit: StatsUnit;
  private updatedAt: UpdatedAt;

  public static of(statsID: StatsID, language: Language, region: Region, term: Term, name: StatsName, unit: StatsUnit, updatedAt: UpdatedAt): StatsOutline {
    return new StatsOutline(statsID, language, region, term, name, unit, updatedAt);
  }

  public static ofJSON(json: StatsOutlineJSON): StatsOutline {
    const {
      statsID,
      language,
      region,
      termID,
      name,
      unit,
      updatedAt
    } = json;

    return StatsOutline.of(
      StatsID.of(statsID),
      Language.ofJSON(language),
      Region.ofJSON(region),
      Term.of(termID),
      StatsName.of(name),
      StatsUnit.of(unit),
      UpdatedAt.ofString(updatedAt)
    );
  }

  public static ofRow(row: StatsOutlineRow): StatsOutline {
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

    return StatsOutline.of(
      StatsID.of(statsID),
      language,
      region,
      Term.of(termID),
      StatsName.of(name),
      StatsUnit.of(unit),
      UpdatedAt.ofString(updatedAt)
    );
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
      statsID: statsID.get(),
      language: language.toJSON(),
      region: region.toJSON(),
      termID: term.getID(),
      name: name.get(),
      unit: unit.get(),
      updatedAt: updatedAt.getString()
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