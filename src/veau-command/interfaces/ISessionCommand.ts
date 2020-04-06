import { Try } from '../../veau-general/Try/Try';
import { ICommand } from './ICommand';

export interface ISessionCommand<E extends Error> extends ICommand {
  readonly noun: 'SessionCommand';

  delete(): Promise<Try<void, E>>;
}
