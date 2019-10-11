import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Locale } from '../../../veau-vo/aggregate/Locale';
import { Stats } from '../../../veau-entity/Stats';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
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
  statsISO3166Selected,
  statsISO639Selected,
  statsNameTyped,
  statsUnitTyped
} from '../../actions/StatsEditAction';
import { StatsEdit as Component } from '../../components/pages/StatsEdit';
import { State } from '../../State';

type StateProps = {
  stats: Stats;
  statsItem: StatsItem;
  selectingItem?: StatsItem;
  locale: Locale;
};
type DispatchProps = {
  dataFilled: (row: number, column: number, value: number) => void;
  dataDeleted: (row: number, column: number) => void;
  nameTyped: (name: string) => void;
  unitTyped: (unit: string) => void;
  iso639Selected: (iso639: ISO639) => void;
  iso3166Selected: (iso3166: ISO3166) => void;
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
    statsItem,
    statsEdit: {
      selectingItem
    },
    locale
  } = state;

  return {
    stats,
    statsItem,
    selectingItem,
    locale
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
    iso639Selected: (iso639: ISO639): void => {
      dispatch(statsISO639Selected(iso639));
    },
    iso3166Selected: (iso3166: ISO3166): void => {
      dispatch(statsISO3166Selected(iso3166));
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

export const StatsEdit: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps, mapDispatchToProps)(Component);
