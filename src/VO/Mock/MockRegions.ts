import { Regions } from '../Regions';
import { Region } from '../Region';
import { Sequence } from '../../General/Collection/Sequence';

export class MockRegions extends Regions {

  public constructor(...regions: Array<Region>) {
    super(Sequence.of<Region>(regions));
  }
}
