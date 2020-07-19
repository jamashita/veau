import { RouterState } from 'connected-react-router';

import { Heisenberg } from '@jamashita/publikum-monad';

import { Stats } from '../Entity/Stats/Stats';
import { StatsItem } from '../Entity/StatsItem/StatsItem';
import { StatsDisplay } from '../VO/Display/StatsDisplay';
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
  // TODO DELETE -> in cache of indexDB
  locale: Locale;
  modal: Modal;
  notification: Notification;
  pageProvider: PageProvider;
  stats: Stats;
  display: Heisenberg<StatsDisplay>;
  statsEdit: StatsEdit;
  statsItem: StatsItem;
  statsList: StatsList;
  statsListItems: StatsListItems;
  router: RouterState;
}>;
