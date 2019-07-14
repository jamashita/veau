import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Languages } from '../../../veau-entity/collection/Languages';
import { Regions } from '../../../veau-entity/collection/Regions';
import { Stats } from '../../../veau-entity/Stats';
import { StatsOutline } from '../../../veau-entity/StatsOutline';
import { Term } from '../../../veau-enum/Term';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { StatsID } from '../../../veau-vo/StatsID';
import { Action } from '../../actions/Action';
import { pushToStatsEdit } from '../../actions/RedirectAction';
import {
  closeNewStatsModal,
  newStatsISO3166Selected,
  newStatsISO639Selected,
  newStatsNameTyped,
  newStatsTermSelected,
  newStatsUnitTyped,
  openNewStatsModal,
  saveNewStats
} from '../../actions/StatsListAction';
import { StatsList as Component } from '../../components/pages/StatsList';
import { State } from '../../State';

type StateProps = {
  statsOutlines: Array<StatsOutline>;
  open: boolean;
  stats: Stats;
  languages: Languages;
  regions: Regions;
};
type DispatchProps = {
  toStatsEdit: (statsID: StatsID) => void;
  newStatsClicked: () => void;
  closeNewStatsModal: () => void;
  nameTyped: (name: string) => void;
  unitTyped: (unit: string) => void;
  iso639Selected: (iso639: ISO639) => void;
  iso3166Selected: (iso3166: ISO3166) => void;
  termSelected: (term: Term) => void;
  saveNewStats: () => void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    statsOutlines,
    statsList: {
      open,
      stats
    },
    locale
  } = state;

  return {
    statsOutlines,
    open,
    stats,
    languages: locale.getLanguages(),
    regions: locale.getRegions()
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    toStatsEdit: (statsID: StatsID): void => {
      dispatch(pushToStatsEdit(statsID));
    },
    newStatsClicked: (): void => {
      dispatch(openNewStatsModal());
    },
    closeNewStatsModal: (): void => {
      dispatch(closeNewStatsModal());
    },
    nameTyped: (name: string): void => {
      dispatch(newStatsNameTyped(name));
    },
    unitTyped: (unit: string): void => {
      dispatch(newStatsUnitTyped(unit));
    },
    iso639Selected: (iso639: ISO639): void => {
      dispatch(newStatsISO639Selected(iso639));
    },
    iso3166Selected: (iso3166: ISO3166): void => {
      dispatch(newStatsISO3166Selected(iso3166));
    },
    termSelected: (term: Term): void => {
      dispatch(newStatsTermSelected(term));
    },
    saveNewStats: (): void => {
      dispatch(saveNewStats());
    }
  };
};

export const StatsList: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
