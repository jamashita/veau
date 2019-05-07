import { Stats } from '../../../veau-entity/Stats';

export interface IStatsCommand {

  create(stats: Stats): Promise<any>;
}
