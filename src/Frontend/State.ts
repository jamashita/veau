import { RouterState } from 'connected-react-router';
import { Stats } from '../Entity/Stats';
import { StatsItem } from '../Entity/StatsItem';
import { EntranceInformation } from '../VO/EntranceInformation';
import { LoadingCount } from '../VO/LoadingCount';
import { Locale } from '../VO/Locale';
import { StatsOutlines } from '../VO/StatsOutlines';
import { VeauAccount } from '../VO/VeauAccount';
import { Modal } from './Reducers/Modal';
import { Notification } from './Reducers/Notification';
import { PageProvider } from './Reducers/PageProvider';
import { StatsEdit } from './Reducers/StatsEdit';
import { StatsList } from './Reducers/StatsList';

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
