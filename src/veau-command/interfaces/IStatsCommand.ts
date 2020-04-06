import { Stats } from '../../veau-entity/Stats';
import { AJAXError } from '../../veau-error/AJAXError';
import { Try } from '../../veau-general/Try/Try';

export interface IStatsCommand {

  create(stats: Stats): Promise<Try<void, AJAXError>>;
}
