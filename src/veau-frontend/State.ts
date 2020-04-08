import { RouterState } from 'connected-react-router';
import { Stats } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { EntranceInformation } from '../veau-vo/EntranceInformation';
import { LoadingCount } from '../veau-vo/LoadingCount';
import { Locale } from '../veau-vo/Locale';
import { StatsOutlines } from '../veau-vo/StatsOutlines';
import { VeauAccount } from '../veau-vo/VeauAccount';
import { Modal } from './reducers/modal';
import { Notification } from './reducers/notification';
import { PageProvider } from './reducers/pageProvider';
import { StatsEdit } from './reducers/statsEdit';
import { StatsList } from './reducers/statsList';

export type State = Readonly<{
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
  statsOutlines: StatsOutlines;
  router: RouterState;
}>;
