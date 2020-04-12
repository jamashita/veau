import { StatsOutline } from '../StatsOutline';
import { StatsID } from '../StatsID';
import { Language } from '../Language';
import { Region } from '../Region';
import { Term } from '../Term';
import { StatsName } from '../StatsName';
import { StatsUnit } from '../StatsUnit';
import { UpdatedAt } from '../UpdatedAt';
import { MockStatsID } from './MockStatsID';
import { MockLanguage } from './MockLanguage';
import { MockRegion } from './MockRegion';
import { MockTerm } from './MockTerm';
import { MockStatsName } from './MockStatsName';
import { MockStatsUnit } from './MockStatsUnit';
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
