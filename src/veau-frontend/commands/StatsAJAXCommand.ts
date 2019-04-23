import { Stats } from '../../veau-entity/Stats';
import { AJAX } from '../../veau-general/AJAX';
import { IStatsCommand } from './interfaces/IStatsCommand';

export class StatsAJAXCommand implements IStatsCommand {
  private static instance: StatsAJAXCommand = new StatsAJAXCommand();

  public static getInstance(): StatsAJAXCommand {
    return StatsAJAXCommand.instance;
  }

  private constructor() {
  }

  public create(stats: Stats): Promise<any> {
    return AJAX.post('/api/stats', stats.toJSON());
  }
}
