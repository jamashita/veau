import { RouterState } from 'connected-react-router';
import { Stats } from '../Entity/Stats';
import { StatsItem } from '../Entity/StatsItem';
import { EntranceInformation } from '../VO/EntranceInformation';
import { LoadingCount } from '../VO/LoadingCount';
import { Locale } from '../VO/Locale';
import { StatsOutlines } from '../VO/StatsOutlines';
import { VeauAccount } from '../VO/VeauAccount';
import { Modal } from './reducers/Modal';
import { Notification } from './reducers/Notification';
import { PageProvider } from './reducers/PageProvider';
import { StatsEdit } from './reducers/StatsEdit';
import { StatsList } from './reducers/StatsList';

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
