import { Nullable } from '@jamashita/anden-type';
import { AsOf } from '../../AsOf/AsOf';
import { Language } from '../../Language/Language';
import { MockLanguage } from '../../Language/mock/MockLanguage';
import { MockRegion } from '../../Region/mock/MockRegion';
import { Region } from '../../Region/Region';
import { StatsItems } from '../../StatsItem/StatsItems';
import { MockStatsOutline } from '../../StatsOutline/mock/MockStatsOutline';
import { StatsOutline } from '../../StatsOutline/StatsOutline';
import { Term } from '../../Term/Term';
import { Stats } from '../Stats';

type StatsArgs = Partial<Readonly<{
  outline: StatsOutline;
  language: Language;
  region: Region;
  term: Term;
  items: StatsItems;
  startDate: Nullable<AsOf>;
}>>;

export class MockStats extends Stats {
  public constructor({
    outline = new MockStatsOutline(),
    language = new MockLanguage(),
    region = new MockRegion(),
    term = Term.ANNUAL,
    items = StatsItems.empty(),
    startDate = null
  }: StatsArgs = {}) {
    super(outline, language, region, term, items, startDate);
  }
}
