import { RouterState } from 'connected-react-router';
import { Stats } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { StatsOutline } from '../veau-entity/StatsOutline';
import { VeauAccount } from '../veau-entity/VeauAccount';
import { EntranceInformation } from '../veau-vo/EntranceInformation';
import { LoadingCount } from './reducers/loadingCount';
import { Locale } from './reducers/locale';
import { Modal } from './reducers/modal';
import { Notification } from './reducers/notification';
import { PageProvider } from './reducers/pageProvider';
import { StatsEdit } from './reducers/statsEdit';
import { StatsList } from './reducers/statsList';

export type State = {
  entranceInformation: EntranceInformation;
  identity: VeauAccount;
  loadingCount: LoadingCount;
  locale: Locale;
  modal: Modal;
  notification: Notification;
  pageProvider: PageProvider;
  stats: Stats;
  statsEdit: StatsEdit;
  statsItem: StatsItem;
  statsList: StatsList;
  statsOutlines: Array<StatsOutline>;
  router: RouterState;
};
