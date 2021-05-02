import { RouterState } from 'connected-react-router';
import { EntranceInformation } from '../domain/VO/EntranceInformation/EntranceInformation';
import { Identity } from '../domain/VO/Identity/Identity';
import { LoadingCount } from '../domain/VO/LoadingCount/LoadingCount';
import { Locale } from '../domain/VO/Locale/Locale';
import { PageProvider } from '../domain/VO/PageProvider/PageProvider';
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
