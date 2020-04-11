import { UnimplementedError } from '../../veau-general/UnimplementedError';
import { UUID } from '../../veau-general/UUID/UUID';
import { StatsItemID } from '../StatsItemID';

export class MockStatsItemID extends StatsItemID {

  public constructor(uuid: UUID) {
    super(uuid);
  }

  public get(): UUID {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public equals(other: StatsItemID): boolean {
    throw new UnimplementedError();
  }

  public toString(): string {
    throw new UnimplementedError();
  }
}
