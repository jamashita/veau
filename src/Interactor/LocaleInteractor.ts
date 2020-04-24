import { inject, injectable } from 'inversify';
import { DataSourceError, Dead, Noun, Alive, Superposition } from 'publikum';
import { ILanguageCommand } from '../Command/Interface/ILanguageCommand';
import { IRegionCommand } from '../Command/Interface/IRegionCommand';
import { TYPE } from '../Container/Types';
import { NoSuchElementError } from '../Error/NoSuchElementError';
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

  public async all(): Promise<Superposition<Locale, NoSuchElementError | DataSourceError>> {
    const [
      languagesSuperposition,
      regionsSuperposition
    ]: [
      Superposition<Languages, NoSuchElementError | DataSourceError>,
      Superposition<Regions, NoSuchElementError | DataSourceError>
    ] = await Promise.all<Superposition<Languages, NoSuchElementError | DataSourceError>, Superposition<Regions, NoSuchElementError | DataSourceError>>([
      this.languageQuery.all(),
      this.regionQuery.all()
    ]);

    return languagesSuperposition.match<Locale, NoSuchElementError | DataSourceError>((languages: Languages) => {
      return regionsSuperposition.match<Locale, NoSuchElementError | DataSourceError>((regions: Regions) => {
        return Alive.of<Locale, DataSourceError>(Locale.of(languages, regions));
      }, (err: NoSuchElementError | DataSourceError, self: Dead<Regions, NoSuchElementError | DataSourceError>) => {
        return self.transpose<Locale>();
      });
    }, (err: NoSuchElementError | DataSourceError, self: Dead<Languages, NoSuchElementError | DataSourceError>) => {
      return self.transpose<Locale>();
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
