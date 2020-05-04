import { LanguageID } from '../LanguageID';
import { RegionID } from '../RegionID';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline } from '../StatsOutline';
import { StatsUnit } from '../StatsUnit';
import { Term } from '../Term';
import { UpdatedAt } from '../UpdatedAt';
import { MockLanguageID } from './MockLanguageID';
import { MockRegionID } from './MockRegionID';
import { MockStatsID } from './MockStatsID';
import { MockStatsName } from './MockStatsName';
import { MockStatsUnit } from './MockStatsUnit';
import { MockTerm } from './MockTerm';
import { MockUpdatedAt } from './MockUpdatedAt';

type StatsOutlineArgs = Partial<Readonly<{
  statsID: StatsID;
  languageID: LanguageID;
  regionID: RegionID;
  term: Term;
  name: StatsName;
  unit: StatsUnit;
  updatedAt: UpdatedAt;
}>>;

export class MockStatsOutline extends StatsOutline {

  public constructor({
    statsID = new MockStatsID(),
    languageID = new MockLanguageID(),
    regionID = new MockRegionID(),
    term = new MockTerm(),
    name = new MockStatsName(),
    unit = new MockStatsUnit(),
    updatedAt = new MockUpdatedAt()
  }: StatsOutlineArgs = {}) {
    super(
      statsID,
      languageID,
      regionID,
      term,
      name,
      unit,
      updatedAt
    );
  }
}
