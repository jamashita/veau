import { Language } from '../Language';
import { Region } from '../Region';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline } from '../StatsOutline';
import { StatsUnit } from '../StatsUnit';
import { Term } from '../Term';
import { UpdatedAt } from '../UpdatedAt';
import { MockLanguage } from './MockLanguage';
import { MockRegion } from './MockRegion';
import { MockStatsID } from './MockStatsID';
import { MockStatsName } from './MockStatsName';
import { MockStatsUnit } from './MockStatsUnit';
import { MockTerm } from './MockTerm';
import { MockUpdatedAt } from './MockUpdatedAt';

type StatsOutlineArgs = Partial<Readonly<{
  statsID: StatsID;
  language: Language;
  region: Region;
  term: Term;
  name: StatsName;
  unit: StatsUnit;
  updatedAt: UpdatedAt;
}>>;

export class MockStatsOutline extends StatsOutline {

  public constructor({
    statsID = new MockStatsID(),
    language = new MockLanguage(),
    region = new MockRegion(),
    term = new MockTerm(),
    name = new MockStatsName(),
    unit = new MockStatsUnit(),
    updatedAt = new MockUpdatedAt()
  }: StatsOutlineArgs = {}) {
    super(
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt
    );
  }
}
