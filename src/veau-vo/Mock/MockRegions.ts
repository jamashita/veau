import { Regions } from '../Regions';
import { Region } from '../Region';
import { MockSequence } from '../../veau-general/Collection/Mock/MockSequence';

export class MockRegions extends Regions {

  public constructor(...regions: Array<Region>) {
    super(new MockSequence<Region>(regions));
  }
}
