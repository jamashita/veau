import { RouterState } from 'connected-react-router';
import { EntranceInformation } from '../domain/vo/EntranceInformation/EntranceInformation';
import { Identity } from '../domain/vo/Identity/Identity';
import { LoadingCount } from '../domain/vo/LoadingCount/LoadingCount';
import { Locale } from '../domain/vo/Locale/Locale';
import { PageProvider } from '../domain/vo/PageProvider/PageProvider';
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
