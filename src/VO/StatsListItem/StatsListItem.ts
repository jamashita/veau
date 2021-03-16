import { ValueObject } from '@jamashita/publikum-object';
import { Kind, Nullable } from '@jamashita/publikum-type';
import { Language } from '../Language/Language';
import { Locale } from '../Locale/Locale';
import { Region } from '../Region/Region';
import { StatsOutline } from '../StatsOutline/StatsOutline';
import { Term } from '../Term/Term';
import { Terms } from '../Term/Terms';
import { StatsListItemError } from './Error/StatsListItemError';

export class StatsListItem extends ValueObject<StatsListItem, 'StatsListItem'> {
  public readonly noun: 'StatsListItem' = 'StatsListItem';
  private readonly outline: StatsOutline;
  private readonly language: Language;
  private readonly region: Region;
  private readonly term: Term;

  public static of(outline: StatsOutline, language: Language, region: Region, term: Term): StatsListItem {
    return new StatsListItem(outline, language, region, term);
  }

  public static ofOutline(outline: StatsOutline, locale: Locale, terms: Terms): StatsListItem {
    const language: Nullable<Language> = locale.getLanguages().get(outline.getLanguageID());

    if (Kind.isNull(language)) {
      throw new StatsListItemError('StatsListItem.ofOutline()');
    }

    const region: Nullable<Region> = locale.getRegions().get(outline.getRegionID());

    if (Kind.isNull(region)) {
      throw new StatsListItemError('StatsListItem.ofOutline()');
    }

    const term: Nullable<Term> = terms.get(outline.getTermID());

    if (Kind.isNull(term)) {
      throw new StatsListItemError('StatsListItem.ofOutline()');
    }

    return StatsListItem.of(outline, language, region, term);
  }

  protected constructor(outline: StatsOutline, language: Language, region: Region, term: Term) {
    super();
    this.outline = outline;
    this.language = language;
    this.region = region;
    this.term = term;
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
}
