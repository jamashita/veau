import { Language } from '../../Language/Language';
import { MockLanguages } from '../../Language/Mock/MockLanguages';
import { MockRegions } from '../../Region/Mock/MockRegions';
import { Region } from '../../Region/Region';
import { Locale } from '../Locale';

type LocaleArgs = Partial<Readonly<{
  languages: ReadonlyArray<Language>;
  regions: ReadonlyArray<Region>;
}>>;

export class MockLocale extends Locale {
  public constructor({ languages = [], regions = [] }: LocaleArgs = {}) {
    super(new MockLanguages(...languages), new MockRegions(...regions));
  }
}
