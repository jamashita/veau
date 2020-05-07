import { LanguageID } from '../LanguageID';
import { RegionID } from '../RegionID';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline } from '../StatsOutline';
import { StatsUnit } from '../StatsUnit';
import { TermID } from '../TermID';
import { UpdatedAt } from '../UpdatedAt';
import { MockLanguageID } from './MockLanguageID';
import { MockRegionID } from './MockRegionID';
import { MockStatsID } from './MockStatsID';
import { MockStatsName } from './MockStatsName';
import { MockStatsUnit } from './MockStatsUnit';
import { MockTermID } from './MockTermID';
import { MockUpdatedAt } from './MockUpdatedAt';

type StatsOutlineArgs = Partial<Readonly<{
  statsID: StatsID;
  languageID: LanguageID;
  regionID: RegionID;
  termID: TermID;
  name: StatsName;
  unit: StatsUnit;
  updatedAt: UpdatedAt;
}>>;

export class MockStatsOutline extends StatsOutline {

  public constructor({
    statsID = new MockStatsID(),
    languageID = new MockLanguageID(),
    regionID = new MockRegionID(),
    termID = new MockTermID(),
    name = new MockStatsName(),
    unit = new MockStatsUnit(),
    updatedAt = new MockUpdatedAt()
  }: StatsOutlineArgs = {}) {
    super(
      statsID,
      languageID,
      regionID,
      termID,
      name,
      unit,
      updatedAt
    );
  }
}
