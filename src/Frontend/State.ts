import { RouterState } from 'connected-react-router';
import { EntranceInformation } from '../VO/EntranceInformation/EntranceInformation';
import { Identity } from '../VO/Identity/Identity';
import { LoadingCount } from '../VO/LoadingCount/LoadingCount';
import { Locale } from '../VO/Locale/Locale';
import { PageProvider } from '../VO/PageProvider/PageProvider';
import { Modal } from './Reducer/Modal';
import { Notification } from './Reducer/Notification';
import { StatsEdit } from './Reducer/StatsEdit';
import { StatsList } from './Reducer/StatsList';

export type State = Readonly<{
  entranceInformation: EntranceInformation;
  identity: Identity;
  loadingCount: LoadingCount;
  modal: Modal;
  notification: Notification;
  pageProvider: PageProvider;
  locale: Locale;
  statsEdit: StatsEdit;
  statsList: StatsList;
  router: RouterState;
}>;
