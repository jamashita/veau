import { Stats } from '../../veau-entity/Stats';
import { AJAX } from '../../veau-general/AJAX';

export class StatsCommand {
  private static instance: StatsCommand = new StatsCommand();

  public static getInstance(): StatsCommand {
    return StatsCommand.instance;
  }

  private constructor() {
  }

  public create(stats: Stats): Promise<any> {
    return AJAX.post<any>('/api/stats', stats.toJSON());
  }
}
