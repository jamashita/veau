import { RouterState } from 'connected-react-router';
import { Stats } from '../Entity/Stats';
import { StatsItem } from '../Entity/StatsItem';
import { EntranceInformation } from '../VO/EntranceInformation/EntranceInformation';
import { Identity } from '../VO/Identity/Identity';
import { LoadingCount } from '../VO/LoadingCount/LoadingCount';
import { Locale } from '../VO/Locale/Locale';
import { PageProvider } from '../VO/PageProvider/PageProvider';
import { StatsListItems } from '../VO/StatsListItem/StatsListItems';
import { Modal } from './Reducer/Modal';
import { Notification } from './Reducer/Notification';
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
  statsListItems: StatsListItems;
  router: RouterState;
}>;
