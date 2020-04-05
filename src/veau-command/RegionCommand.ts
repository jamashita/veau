import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { CacheError } from '../veau-error/CacheError';
import { Try } from '../veau-general/Try/Try';
import { Regions } from '../veau-vo/Regions';
import { IRegionCommand } from './interfaces/IRegionCommand';

@injectable()
export class RegionCommand implements IRegionCommand {
  private regionCommand: IRegionCommand;

  public constructor(@inject(TYPE.RegionRedisCommand) regionCommand: IRegionCommand) {
    this.regionCommand = regionCommand;
  }

  public insertAll(regions: Regions): Promise<unknown> {
    return this.regionCommand.insertAll(regions);
  }

  public deleteAll(): Promise<Try<void, CacheError>> {
    return this.regionCommand.deleteAll();
  }
}
