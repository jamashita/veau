import { RouterState } from 'connected-react-router';
import { StatsOverview } from '../veau-entity/StatsOverview';
import { Entrance } from '../veau-frontend/reducers/entrance';
import { LoadingCount } from '../veau-frontend/reducers/loadingCount';
import { Modal } from '../veau-frontend/reducers/modal';
import { PageProvider } from '../veau-frontend/reducers/pageProvider';
import { LocaleRepository } from '../veau-repository/LocaleRepository';
import { Identity } from '../veau-vo/Identity';

export type State = {
  entrance: Entrance;
  identity: Identity;
  loadingCount: LoadingCount;
  localeRepository: LocaleRepository;
  modal: Modal;
  pageProvider: PageProvider;
  statsOverviews: Array<StatsOverview>;
  router: RouterState;
};
