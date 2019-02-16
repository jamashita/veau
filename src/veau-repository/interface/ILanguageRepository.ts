import { ISO639 } from '../veau-vo/ISO639';
import { Language } from '../veau-vo/Language';

export interface ILanguageRepository {

  all(): Promise<Array<Language>>;

  findByISO639(iso639: ISO639): Promise<Language>;

  deleteCache(): Promise<boolean>;
}
