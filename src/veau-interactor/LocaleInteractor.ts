import { inject, injectable } from 'inversify';
import { LanguageCommand } from '../veau-command/LanguageCommand';
import { RegionCommand } from '../veau-command/RegionCommand';
import { TYPE } from '../veau-container/Types';
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

  public constructor(
    @inject(TYPE.LanguageQuery) languageQuery: LanguageQuery,
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
    const languages: Languages = await this.languageQuery.all();
    const regions: Regions = await this.regionQuery.all();

    return Locale.of(languages, regions);
  }

  public delete(): Promise<unknown> {
    return Promise.all<unknown>([
      this.languageCommand.deleteAll(),
      this.regionCommand.deleteAll()
    ]);
  }
}
