import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, Noun, Superposition } from 'publikum';
import { ILanguageCommand } from '../Command/Interface/ILanguageCommand';
import { IRegionCommand } from '../Command/Interface/IRegionCommand';
import { TYPE } from '../Container/Types';
import { LanguagesError } from '../Error/LanguagesError';
import { LocaleError } from '../Error/LocaleError';
import { RegionsError } from '../Error/RegionsError';
import { ILanguageQuery } from '../Query/Interface/ILanguageQuery';
import { IRegionQuery } from '../Query/Interface/IRegionQuery';
import { Languages } from '../VO/Languages';
import { Locale } from '../VO/Locale';
import { Regions } from '../VO/Regions';

@injectable()
export class LocaleInteractor implements Noun {
  public readonly noun: 'LocaleInteractor' = 'LocaleInteractor';
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly languageCommand: ILanguageCommand;
  private readonly regionCommand: IRegionCommand;

  public constructor(
  @inject(TYPE.LanguageKernelQuery) languageQuery: ILanguageQuery,
    @inject(TYPE.RegionKernelQuery) regionQuery: IRegionQuery,
    @inject(TYPE.LanguageRedisCommand) languageCommand: ILanguageCommand,
    @inject(TYPE.RegionRedisCommand) regionCommand: IRegionCommand
  ) {
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.languageCommand = languageCommand;
    this.regionCommand = regionCommand;
  }

  public async all(): Promise<Superposition<Locale, LocaleError | DataSourceError>> {
    const [
      languagesSuperposition,
      regionsSuperposition
    ]: [
      Superposition<Languages, LanguagesError | DataSourceError>,
      Superposition<Regions, RegionsError | DataSourceError>
    ] = await Promise.all<Superposition<Languages, LanguagesError | DataSourceError>, Superposition<Regions, RegionsError | DataSourceError>>([
      this.languageQuery.all(),
      this.regionQuery.all()
    ]);

    return languagesSuperposition.match<Locale, LocaleError | DataSourceError>((languages: Languages) => {
      return regionsSuperposition.match<Locale, LocaleError | DataSourceError>((regions: Regions) => {
        return Alive.of<Locale, DataSourceError>(Locale.of(languages, regions));
      }, (err: RegionsError | DataSourceError) => {
        if (err instanceof RegionsError) {
          return Dead.of<Locale, LocaleError>(new LocaleError('LocaleInteradtor.all()', err));
        }

        return Dead.of<Locale, DataSourceError>(err);
      });
    }, (err: LanguagesError | DataSourceError) => {
      if (err instanceof LanguagesError) {
        return Dead.of<Locale, LocaleError>(new LocaleError('LocaleInteradtor.all()', err));
      }

      return Dead.of<Locale, DataSourceError>(err);
    });
  }

  public async delete(): Promise<Superposition<void, DataSourceError>> {
    const [
      languagesSuperposition,
      regionsSuperposition
    ]: [
      Superposition<void, DataSourceError>,
      Superposition<void, DataSourceError>
    ] = await Promise.all<Superposition<void, DataSourceError>, Superposition<void, DataSourceError>>([
      this.languageCommand.deleteAll(),
      this.regionCommand.deleteAll()
    ]);

    return languagesSuperposition.match<void, DataSourceError>(() => {
      return regionsSuperposition.match<void, DataSourceError>(() => {
        return Alive.of<DataSourceError>();
      }, (err: DataSourceError, self: Dead<void, DataSourceError>) => {
        return self;
      });
    }, (err: DataSourceError, self: Dead<void, DataSourceError>) => {
      return self;
    });
  }
}
