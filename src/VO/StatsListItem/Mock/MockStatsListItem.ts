import { Language } from '../../Language/Language';
import { MockLanguage } from '../../Language/Mock/MockLanguage';
import { MockRegion } from '../../Region/Mock/MockRegion';
import { Region } from '../../Region/Region';
import { StatsListItem } from '../StatsListItem';
import { StatsOutline } from '../../StatsOutline/StatsOutline';
import { Term } from '../../Term/Term';
import { MockStatsOutline } from '../../StatsOutline/Mock/MockStatsOutline';
import { MockTerm } from '../../Term/Mock/MockTerm';

type StatsListItemArgs = Partial<
  Readonly<{
    outline: StatsOutline;
    language: Language;
    region: Region;
    term: Term;
  }>
>;

export class MockStatsListItem extends StatsListItem {
  public constructor({
    outline = new MockStatsOutline(),
    language = new MockLanguage(),
    region = new MockRegion(),
    term = new MockTerm()
  }: StatsListItemArgs = {}) {
    super(outline, language, region, term);
  }
}
