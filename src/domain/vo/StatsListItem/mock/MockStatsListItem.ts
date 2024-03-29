import { Language } from '../../Language/Language';
import { MockLanguage } from '../../Language/mock/MockLanguage';
import { MockRegion } from '../../Region/mock/MockRegion';
import { Region } from '../../Region/Region';
import { MockStatsOutline } from '../../StatsOutline/mock/MockStatsOutline';
import { StatsOutline } from '../../StatsOutline/StatsOutline';
import { Term } from '../../Term/Term';
import { StatsListItem } from '../StatsListItem';

type StatsListItemArgs = Partial<Readonly<{
  outline: StatsOutline;
  language: Language;
  region: Region;
  term: Term;
}>>;

export class MockStatsListItem extends StatsListItem {
  public constructor({
    outline = new MockStatsOutline(),
    language = new MockLanguage(),
    region = new MockRegion(),
    term = Term.ANNUAL
  }: StatsListItemArgs = {}) {
    super(outline, language, region, term);
  }
}
