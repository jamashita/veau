import { Languages } from '../Languages';
import { Locale } from '../Locale';
import { Regions } from '../Regions';
import { MockLanguages } from './MockLanguages';
import { MockRegions } from './MockRegions';

type LocaleArgs = Partial<
  Readonly<{
    languages: Languages;
    regions: Regions;
  }>
>;

export class MockLocale extends Locale {
  public constructor({ languages = new MockLanguages(), regions = new MockRegions() }: LocaleArgs = {}) {
    super(languages, regions);
  }
}
