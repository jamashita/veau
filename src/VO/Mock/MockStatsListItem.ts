import { Language } from '../Language';
import { Region } from '../Region';
import { StatsListItem } from '../StatsListItem';
import { StatsOutline } from '../StatsOutline';
import { Term } from '../Term';
import { MockLanguage } from './MockLanguage';
import { MockRegion } from './MockRegion';
import { MockStatsOutline } from './MockStatsOutline';
import { MockTerm } from './MockTerm';

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
    term = new MockTerm()
  }: StatsListItemArgs = {}) {
    super(
      outline,
      language,
      region,
      term
    );
  }
}
