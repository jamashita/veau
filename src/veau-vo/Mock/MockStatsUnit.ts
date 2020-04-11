import { StatsUnit } from '../StatsUnit';

export class MockStatsUnit extends StatsUnit {

  public constructor(unit: string = 'MOCK STATS UNIT') {
    super(unit);
  }
}
