import { RouterState } from 'connected-react-router';
import { Stats } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { StatsOverview } from '../veau-entity/StatsOverview';
import { VeauAccount } from '../veau-entity/VeauAccount';
import { LoadingCount } from '../veau-frontend/reducers/loadingCount';
import { Modal } from '../veau-frontend/reducers/modal';
import { Notification } from '../veau-frontend/reducers/notification';
import { PageProvider } from '../veau-frontend/reducers/pageProvider';
import { StatsEdit } from '../veau-frontend/reducers/statsEdit';
import { StatsList } from '../veau-frontend/reducers/statsList';
import { LocaleRepository } from '../veau-repository/LocaleRepository';
import { EntranceInformation } from '../veau-vo/EntranceInformation';

export type State = {
  entranceInformation: EntranceInformation;
  identity: VeauAccount;
  loadingCount: LoadingCount;
  localeRepository: LocaleRepository;
  modal: Modal;
  notification: Notification;
  pageProvider: PageProvider;
  stats: Stats;
  statsEdit: StatsEdit;
  statsItem: StatsItem;
  statsList: StatsList;
  statsOverviews: Array<StatsOverview>;
  router: RouterState;
};
