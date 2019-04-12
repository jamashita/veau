import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';

export interface ILanguageQuery {

  allLanguages(): Promise<Array<Language>>;

  findByISO639(iso639: ISO639): Promise<Language>;
}
