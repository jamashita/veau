import { inject, injectable } from 'inversify';
import { LanguageCommand } from '../veau-command/LanguageCommand';
import { RegionCommand } from '../veau-command/RegionCommand';
import { TYPE } from '../veau-container/Types';
import { CacheError } from '../veau-error/CacheError';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { LanguageQuery } from '../veau-query/LanguageQuery';
import { RegionQuery } from '../veau-query/RegionQuery';
import { Languages } from '../veau-vo/Languages';
import { Locale } from '../veau-vo/Locale';
import { Regions } from '../veau-vo/Regions';

@injectable()
export class LocaleInteractor {
  private languageQuery: LanguageQuery;
  private regionQuery: RegionQuery;
  private languageCommand: LanguageCommand;
  private regionCommand: RegionCommand;

  public constructor(@inject(TYPE.LanguageQuery) languageQuery: LanguageQuery,
    @inject(TYPE.RegionQuery) regionQuery: RegionQuery,
    @inject(TYPE.LanguageCommand) languageCommand: LanguageCommand,
    @inject(TYPE.RegionCommand) regionCommand: RegionCommand
  ) {
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.languageCommand = languageCommand;
    this.regionCommand = regionCommand;
  }
  public async all(): Promise<Locale> {
    const [
      languages,
      regions
    ]: [
      Languages,
      Regions
    ] = await Promise.all([
      this.languageQuery.all(),
      this.regionQuery.all()
    ]);

    return Locale.of(languages, regions);
  }

  public async delete(): Promise<Try<void, CacheError>> {
    const ret: [Try<void, CacheError>, Try<void, CacheError>] = await Promise.all([
      this.languageCommand.deleteAll(),
      this.regionCommand.deleteAll()
    ]);

    if (ret[0].isFailure()) {
      return ret[0];
    }

    if (ret[1].isFailure()) {
      return ret[1];
    }

    return Success.of<void, CacheError>(undefined);
  }
}
