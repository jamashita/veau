import { inject, injectable } from 'inversify';
import { LanguageCommand } from '../veau-command/LanguageCommand';
import { RegionCommand } from '../veau-command/RegionCommand';
import { TYPE } from '../veau-container/Types';
import { CacheError } from '../veau-error/CacheError';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { ILanguageQuery } from '../veau-query/interfaces/ILanguageQuery';
import { IRegionQuery } from '../veau-query/interfaces/IRegionQuery';
import { Languages } from '../veau-vo/Languages';
import { Locale } from '../veau-vo/Locale';
import { Regions } from '../veau-vo/Regions';

@injectable()
export class LocaleInteractor {
  private languageQuery: ILanguageQuery;
  private regionQuery: IRegionQuery;
  private languageCommand: LanguageCommand;
  private regionCommand: RegionCommand;

  public constructor(@inject(TYPE.LanguageQuery) languageQuery: ILanguageQuery,
    @inject(TYPE.RegionQuery) regionQuery: IRegionQuery,
    @inject(TYPE.LanguageCommand) languageCommand: LanguageCommand,
    @inject(TYPE.RegionCommand) regionCommand: RegionCommand
  ) {
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.languageCommand = languageCommand;
    this.regionCommand = regionCommand;
  }
  public async all(): Promise<Try<Locale, NoSuchElementError>> {
    const trials: [
      Try<Languages, NoSuchElementError>,
      Try<Regions, NoSuchElementError>
    ] = await Promise.all([
      this.languageQuery.all(),
      this.regionQuery.all()
    ]);

    return trials[0].match<Try<Locale, NoSuchElementError>>((languages: Languages) => {
      return trials[1].match<Try<Locale, NoSuchElementError>>((regions: Regions) => {
        return Success.of<Locale, NoSuchElementError>(Locale.of(languages, regions));
      }, (err: NoSuchElementError) => {
        return Failure.of<Locale, NoSuchElementError>(err);
      });
    }, (err: NoSuchElementError) => {
      return Failure.of<Locale, NoSuchElementError>(err);
    });
  }

  public async delete(): Promise<Try<void, CacheError>> {
    const trials: [Try<void, CacheError>, Try<void, CacheError>] = await Promise.all([
      this.languageCommand.deleteAll(),
      this.regionCommand.deleteAll()
    ]);

    if (trials[0].isFailure()) {
      return trials[0];
    }
    if (trials[1].isFailure()) {
      return trials[1];
    }

    return Success.of<void, CacheError>(undefined);
  }
}
