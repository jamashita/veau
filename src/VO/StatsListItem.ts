import { ValueObject } from 'publikum';
import { Language } from './Language';
import { Region } from './Region';
import { StatsOutline } from './StatsOutline';
import { Term } from './Term';

export class StatsListItem extends ValueObject {
  public readonly noun: 'StatsDisplay' = 'StatsDisplay';
  private readonly outline: StatsOutline;
  private readonly language: Language;
  private readonly region: Region;
  private readonly term: Term;

  public static of(
    outline: StatsOutline,
    language: Language,
    region: Region,
    term: Term
  ): StatsListItem {
    return new StatsListItem(outline, language, region, term);
  }

  protected constructor(
    outline: StatsOutline,
    language: Language,
    region: Region,
    term: Term
  ) {
    super();
    this.outline = outline;
    this.language = language;
    this.region = region;
    this.term = term;
  }

  public getOutline(): StatsOutline {
    return this.outline;
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

  public equals(other: StatsListItem): boolean {
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

    return true;
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.outline.toString());
    properties.push(this.language.toString());
    properties.push(this.region.toString());
    properties.push(this.term.toString());

    return properties.join(' ');
  }
}
