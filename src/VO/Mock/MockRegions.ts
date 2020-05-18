import { ImmutableSequence } from 'publikum';
import { Region } from '../Region';
import { Regions } from '../Regions';

export class MockRegions extends Regions {
  public constructor(...regions: Array<Region>) {
    super(ImmutableSequence.of<Region>(regions));
  }
}
