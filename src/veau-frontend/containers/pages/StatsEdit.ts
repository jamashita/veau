import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Stats } from '../../../veau-entity/Stats';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { Term } from '../../../veau-enum/Term';
import { LocaleMemoryQuery } from '../../../veau-query/LocaleMemoryQuery';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { Action } from '../../actions/Action';
import {
  invalidValueInput,
  itemNameTyped,
  removeItem,
  rowMoved,
  rowSelected,
  saveItem,
  saveStats,
  selectingItemNameTyped,
  startDateDetermined,
  statsDataDeleted,
  statsDataFilled,
  statsLanguageSelected,
  statsNameTyped,
  statsRegionSelected,
  statsTermSelected,
  statsUnitTyped
} from '../../actions/StatsEditAction';
import { StatsEdit as Component } from '../../components/pages/StatsEdit';
import { State } from '../../State';

type StateProps = {
  stats: Stats;
  localeMemoryQuery: LocaleMemoryQuery;
  statsItem: StatsItem;
  selectingItem?: StatsItem;
};
type DispatchProps = {
  dataFilled: (row: number, column: number, value: number) => void;
  dataDeleted: (row: number, column: number) => void;
  nameTyped: (name: string) => void;
  unitTyped: (unit: string) => void;
  languageSelected: (language: Language) => void;
  regionSelected: (region: Region) => void;
  termSelected: (term: Term) => void;
  itemNameTyped: (name: string) => void;
  saveNewItem: () => void;
  rowSelected: (row: number) => void;
  selectingItemNameTyped: (name: string) => void;
  startDateDetermined: (startDate: string) => void;
  rowMoved: (column: number, target: number) => void;
  invalidValueInput: () => void;
  removeItem: (statsItem: StatsItem) => void;
  save: () => void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    stats,
    localeMemoryQuery,
    statsItem,
    statsEdit: {
      selectingItem
    }
  } = state;

  return {
    stats,
    localeMemoryQuery,
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
    unitTyped: (unit: string): void => {
      dispatch(statsUnitTyped(unit));
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
    saveNewItem: (): void => {
      dispatch(saveItem());
    },
    rowSelected: (row: number): void => {
      dispatch(rowSelected(row));
    },
    selectingItemNameTyped: (name: string): void => {
      dispatch(selectingItemNameTyped(name));
    },
    startDateDetermined: (startDate: string): void => {
      dispatch(startDateDetermined(startDate));
    },
    rowMoved: (column: number, target: number): void => {
      dispatch(rowMoved(column, target));
    },
    invalidValueInput: (): void => {
      dispatch(invalidValueInput());
    },
    removeItem: (statsItem: StatsItem): void => {
      dispatch(removeItem(statsItem));
    },
    save: (): void => {
      dispatch(saveStats());
    }
  };
};

export const StatsEdit: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
