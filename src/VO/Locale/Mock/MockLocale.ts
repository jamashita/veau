import { Language } from '../../Language/Language';
import { MockLanguages } from '../../Language/Mock/MockLanguages';
import { MockRegions } from '../../Region/Mock/MockRegions';
import { Region } from '../../Region/Region';
import { Locale } from '../Locale';

type LocaleArgs = Partial<
  Readonly<{
    languages: Array<Language>;
    regions: Array<Region>;
  }>
>;

export class MockLocale extends Locale {
  private static toLanguages(languages: Array<Language>): MockLanguages {
    return new MockLanguages(...languages);
  }

  private static toRegions(regions: Array<Region>): MockRegions {
    return new MockRegions(...regions);
  }

  public constructor({ languages = [], regions = [] }: LocaleArgs = {}) {
    super(MockLocale.toLanguages(languages), MockLocale.toRegions(regions));
  }
}
