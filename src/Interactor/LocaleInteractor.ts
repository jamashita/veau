import { DataSourceError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { inject, injectable } from 'inversify';
import { ILanguageCommand } from '../Command/Interface/ILanguageCommand';
import { IRegionCommand } from '../Command/Interface/IRegionCommand';
import { Type } from '../Container/Types';
import { ILanguageQuery } from '../Query/Interface/ILanguageQuery';
import { IRegionQuery } from '../Query/Interface/IRegionQuery';
import { LanguageError } from '../VO/Language/Error/LanguageError';
import { Languages } from '../VO/Language/Languages';
import { LocaleError } from '../VO/Locale/Error/LocaleError';
import { Locale } from '../VO/Locale/Locale';
import { RegionError } from '../VO/Region/Error/RegionError';
import { Regions } from '../VO/Region/Regions';

@injectable()
export class LocaleInteractor implements Noun<'LocaleInteractor'> {
  public readonly noun: 'LocaleInteractor' = 'LocaleInteractor';
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly languageCommand: ILanguageCommand;
  private readonly regionCommand: IRegionCommand;

  public constructor(
    @inject(Type.LanguageKernelQuery) languageQuery: ILanguageQuery,
    @inject(Type.RegionKernelQuery) regionQuery: IRegionQuery,
    @inject(Type.LanguageRedisCommand) languageCommand: ILanguageCommand,
    @inject(Type.RegionRedisCommand) regionCommand: IRegionCommand
  ) {
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.languageCommand = languageCommand;
    this.regionCommand = regionCommand;
  }

  public all(): Superposition<Locale, LocaleError | DataSourceError> {
    return this.languageQuery.all().map<Locale, LanguageError | RegionError | DataSourceError>((languages: Languages) => {
      return this.regionQuery.all().map<Locale, RegionError | DataSourceError>((regions: Regions) => {
        return Locale.of(languages, regions);
      });
    }).recover<Locale, LocaleError>((err: LanguageError | RegionError | DataSourceError) => {
      if (err instanceof DataSourceError) {
        throw err;
      }

      throw new LocaleError('LocaleInteradtor.all()', err);
    }, LocaleError, DataSourceError);
  }

  public delete(): Superposition<unknown, DataSourceError> {
    return Superposition.all<unknown, DataSourceError>([
      this.languageCommand.deleteAll(),
      this.regionCommand.deleteAll()
    ]);
  }
}
