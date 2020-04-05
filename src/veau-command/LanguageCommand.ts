import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { CacheError } from '../veau-error/CacheError';
import { Try } from '../veau-general/Try/Try';
import { Languages } from '../veau-vo/Languages';
import { ILanguageCommand } from './interfaces/ILanguageCommand';

@injectable()
export class LanguageCommand implements ILanguageCommand {
  private readonly languageCommand: ILanguageCommand;

  public constructor(@inject(TYPE.LanguageRedisCommand) languageCommand: ILanguageCommand) {
    this.languageCommand = languageCommand;
  }

  public insertAll(languages: Languages): Promise<unknown> {
    return this.languageCommand.insertAll(languages);
  }

  public deleteAll(): Promise<Try<void, CacheError>> {
    return this.languageCommand.deleteAll();
  }
}
