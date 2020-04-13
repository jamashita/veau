import { Regions } from '../Regions';
import { Region } from '../Region';
import { ImmutableSequence } from '../../General/Collection/ImmutableSequence';

export class MockRegions extends Regions {

  public constructor(...regions: Array<Region>) {
    super(ImmutableSequence.of<Region>(regions));
  }
}
