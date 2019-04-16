import { LanguageJSON } from '../../veau-vo/Language';
import { RegionJSON } from '../../veau-vo/Region';

export type Locales = {
  languages: Array<LanguageJSON>;
  regions: Array<RegionJSON>;
};

export interface ILocaleUseCase {

  all(): Promise<Locales>;

  deleteCache(): Promise<any>;
}
