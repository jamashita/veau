import { Region } from '../../veau-vo/Region';

export interface IRegionCommand {

  insertAll(regions: Array<Region>): Promise<any>;

  deleteAll(): Promise<any>;
}
