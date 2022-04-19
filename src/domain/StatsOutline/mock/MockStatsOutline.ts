import { UUID } from '@jamashita/anden-uuid';
import { LanguageID } from '../../Language/LanguageID';
import { RegionID } from '../../Region/RegionID';
import { TermID } from '../../Term/TermID';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline } from '../StatsOutline';
import { StatsUnit } from '../StatsUnit';
import { UpdatedAt } from '../UpdatedAt';
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
    statsID = StatsID.of(UUID.v4()),
    languageID = LanguageID.of(UUID.v4()),
    regionID = RegionID.of(UUID.v4()),
    termID = TermID.of(UUID.v4()),
    name = StatsName.empty(),
    unit = StatsUnit.empty(),
    updatedAt = new MockUpdatedAt()
  }: StatsOutlineArgs = {}) {
    super(statsID, languageID, regionID, termID, name, unit, updatedAt);
  }
}
