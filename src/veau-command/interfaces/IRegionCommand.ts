import { Region } from '@/veau-entity/Region';

export interface IRegionCommand {

  insertAll(regions: Array<Region>): Promise<any>;

  deleteAll(): Promise<any>;
}
