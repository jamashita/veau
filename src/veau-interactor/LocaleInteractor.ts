import { LanguageCommand } from '../veau-command/LanguageCommand';
import { RegionCommand } from '../veau-command/RegionCommand';
import { Locale } from '../veau-vo/aggregate/Locale';
import { Languages } from '../veau-vo/collection/Languages';
import { Regions } from '../veau-vo/collection/Regions';
import { LanguageQuery } from '../veau-query/LanguageQuery';
import { RegionQuery } from '../veau-query/RegionQuery';

const languageQuery: LanguageQuery = LanguageQuery.getInstance();
const languageCommand: LanguageCommand = LanguageCommand.getInstance();
const regionQuery: RegionQuery = RegionQuery.getInstance();
const regionCommand: RegionCommand = RegionCommand.getInstance();

export class LocaleInteractor {
  private static instance: LocaleInteractor = new LocaleInteractor();

  public static getInstance(): LocaleInteractor {
    return LocaleInteractor.instance;
  }

  private constructor() {
  }

  public async all(): Promise<Locale> {
    const languages: Languages = await languageQuery.all();
    const regions: Regions = await regionQuery.all();

    return Locale.from(languages, regions);
  }

  public delete(): Promise<unknown> {
    return Promise.all<unknown>([
      languageCommand.deleteAll(),
      regionCommand.deleteAll()
    ]);
  }
}
