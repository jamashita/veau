import { RouterState } from 'connected-react-router';
import { StatsOverview } from '../veau-entity/StatsOverview';
import { Entrance } from '../veau-frontend/reducers/entrance';
import { LoadingCount } from '../veau-frontend/reducers/loadingCount';
import { Locales } from '../veau-frontend/reducers/locales';
import { Modal } from '../veau-frontend/reducers/modal';
import { PageProvider } from '../veau-frontend/reducers/pageProvider';
import { Identity } from '../veau-vo/Identity';

export type State = {
  entrance: Entrance;
  identity: Identity;
  loadingCount: LoadingCount;
  locales: Locales;
  modal: Modal;
  pageProvider: PageProvider;
  statsOverviews: Array<StatsOverview>;
  router: RouterState;
};
