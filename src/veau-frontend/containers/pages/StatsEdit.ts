import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { Stats } from '../../../veau-entity/Stats';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { LocaleRepository } from '../../../veau-repository/LocaleRepository';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { Term } from '../../../veau-vo/Term';
import {
  closeItemModal, itemNameTyped, itemUnitTyped,
  newItem,
  statsDataFilled,
  statsLanguageSelected,
  statsNameTyped,
  statsRegionSelected,
  statsTermSelected
} from '../../actions/StatsEditAction';
import { StatsEdit as Component } from '../../components/pages/StatsEdit';

type StateProps = {
  stats: Stats;
  localeRepository: LocaleRepository;
  statsItem: StatsItem;
  open: boolean;
};
type DispatchProps = {
  dataFilled: (row: number, column: number, value: number) => void;
  nameTyped: (name: string) => void;
  languageSelected: (language: Language) => void;
  regionSelected: (region: Region) => void;
  termSelected: (term: Term) => void;
  newItemButtonClicked: () => void;
  closeNewItemModal: () => void;
  itemNameTyped: (name: string) => void;
  itemUnitTyped: (unit: string) => void;
  saveNewItem: () => void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    stats,
    localeRepository,
    statsItem,
    statsEdit: {
      open
    }
  } = state;

  return {
    stats,
    localeRepository,
    statsItem,
    open
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    dataFilled: (row: number, column: number, value: number): void => {
      dispatch(statsDataFilled(row, column, value));
    },
    nameTyped: (name: string): void => {
      dispatch(statsNameTyped(name));
    },
    languageSelected: (language: Language): void => {
      dispatch(statsLanguageSelected(language));
    },
    regionSelected: (region: Region): void => {
      dispatch(statsRegionSelected(region));
    },
    termSelected: (term: Term): void => {
      dispatch(statsTermSelected(term));
    },
    newItemButtonClicked: (): void => {
      dispatch(newItem());
    },
    closeNewItemModal: (): void => {
      dispatch(closeItemModal());
    },
    itemNameTyped: (name: string): void => {
      dispatch(itemNameTyped(name));
    },
    itemUnitTyped: (unit: string): void => {
      dispatch(itemUnitTyped(unit));
    },
    saveNewItem: (): void => {
      console.log('saved');
    }
  };
};

export const StatsEdit: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
