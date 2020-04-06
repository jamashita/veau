import { SourceError } from '../../veau-general/SourceError';
import { Try } from '../../veau-general/Try/Try';
import { ICommand } from './ICommand';

export interface ISessionCommand<E extends SourceError> extends ICommand {
  readonly noun: 'SessionCommand';

  delete(): Promise<Try<void, E>>;
}
