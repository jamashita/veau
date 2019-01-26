import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { Stats } from '../../../veau-entity/Stats';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { Term } from '../../../veau-enum/Term';
import { LocaleRepository } from '../../../veau-repository/LocaleRepository';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import {
  itemNameTyped, itemUnitTyped, rowSelected,
  saveItem, selectingItemNameTyped, selectingItemUnitTyped, statsDataDeleted,
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
  selectingItem?: StatsItem;
};
type DispatchProps = {
  dataFilled: (row: number, column: number, value: number) => void;
  dataDeleted: (row: number, column: number) => void;
  nameTyped: (name: string) => void;
  languageSelected: (language: Language) => void;
  regionSelected: (region: Region) => void;
  termSelected: (term: Term) => void;
  itemNameTyped: (name: string) => void;
  itemUnitTyped: (unit: string) => void;
  saveNewItem: () => void;
  rowSelected: (row: number) => void;
  selectingItemNameTyped: (name: string) => void;
  selectingItemUnitTyped: (unit: string) => void;
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
      selectingItem
    }
  } = state;

  return {
    stats,
    localeRepository,
    statsItem,
    selectingItem
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    dataFilled: (row: number, column: number, value: number): void => {
      dispatch(statsDataFilled(row, column, value));
    },
    dataDeleted: (row: number, column: number): void => {
      dispatch(statsDataDeleted(row, column));
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
    itemNameTyped: (name: string): void => {
      dispatch(itemNameTyped(name));
    },
    itemUnitTyped: (unit: string): void => {
      dispatch(itemUnitTyped(unit));
    },
    saveNewItem: (): void => {
      dispatch(saveItem());
    },
    rowSelected: (row: number): void => {
      dispatch(rowSelected(row));
    },
    selectingItemNameTyped: (name: string): void => {
      dispatch(selectingItemNameTyped(name));
    },
    selectingItemUnitTyped: (unit: string): void => {
      dispatch(selectingItemUnitTyped(unit));
    }
  };
};

export const StatsEdit: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
