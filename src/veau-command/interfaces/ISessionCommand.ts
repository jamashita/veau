import { AJAXError } from '../../veau-error/AJAXError';
import { Try } from '../../veau-general/Try/Try';

export interface ISessionCommand {

  delete(): Promise<Try<void, AJAXError>>;
}
