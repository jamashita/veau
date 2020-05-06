import { RouterState } from 'connected-react-router';
import { Stats } from '../Entity/Stats';
import { StatsItem } from '../Entity/StatsItem';
import { EntranceInformation } from '../VO/EntranceInformation';
import { Identity } from '../VO/Identity';
import { LoadingCount } from '../VO/LoadingCount';
import { Locale } from '../VO/Locale';
import { StatsOutlines } from '../VO/StatsOutlines';
import { Modal } from './Reducer/Modal';
import { Notification } from './Reducer/Notification';
import { PageProvider } from './Reducer/PageProvider';
import { StatsEdit } from './Reducer/StatsEdit';
import { StatsList } from './Reducer/StatsList';

export type State = Readonly<{
  entranceInformation: EntranceInformation;
  identity: Identity;
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
