import { CREATED } from 'http-status';
import { Stats } from '../../veau-entity/Stats';
import { AJAXError } from '../../veau-error/AJAXError';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';

export class StatsCommand {
  private static instance: StatsCommand = new StatsCommand();

  public static getInstance(): StatsCommand {
    return StatsCommand.instance;
  }

  private constructor() {
  }

  public async create(stats: Stats): Promise<any> {
    const response: AJAXResponse<any> = await AJAX.post<any>('/api/stats', stats.toJSON());

    switch (response.status) {
      case CREATED: {
        return;
      }
      default: {
        throw new AJAXError('UNKNOWN ERROR');
      }
    }
  }
}
