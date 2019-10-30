import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Stats } from '../../../veau-entity/Stats';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { AsOf } from '../../../veau-vo/AsOf';
import { Column } from '../../../veau-vo/Column';
import { Coordinate } from '../../../veau-vo/Coordinate';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Locale } from '../../../veau-vo/Locale';
import { NumericalValue } from '../../../veau-vo/NumericalValue';
import { Row } from '../../../veau-vo/Row';
import { StatsItemName } from '../../../veau-vo/StatsItemName';
import { StatsName } from '../../../veau-vo/StatsName';
import { StatsUnit } from '../../../veau-vo/StatsUnit';
import { Action } from '../../actions/Action';
import {
  invalidDateInput,
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
  dataFilled: (coordinate: Coordinate, value: NumericalValue) => void;
  dataDeleted: (coordinate: Coordinate) => void;
  nameTyped: (name: StatsName) => void;
  unitTyped: (unit: StatsUnit) => void;
  iso639Selected: (iso639: ISO639) => void;
  iso3166Selected: (iso3166: ISO3166) => void;
  itemNameTyped: (name: StatsItemName) => void;
  saveNewItem: () => void;
  rowSelected: (row: Row) => void;
  selectingItemNameTyped: (name: StatsItemName) => void;
  startDateDetermined: (startDate: AsOf) => void;
  invalidDateInput: () => void;
  rowMoved: (column: Column, target: Column) => void;
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
    dataFilled: (coordinate: Coordinate, value: NumericalValue): void => {
      dispatch(statsDataFilled(coordinate, value));
    },
    dataDeleted: (coordinate: Coordinate): void => {
      dispatch(statsDataDeleted(coordinate));
    },
    nameTyped: (name: StatsName): void => {
      dispatch(statsNameTyped(name));
    },
    unitTyped: (unit: StatsUnit): void => {
      dispatch(statsUnitTyped(unit));
    },
    iso639Selected: (iso639: ISO639): void => {
      dispatch(statsISO639Selected(iso639));
    },
    iso3166Selected: (iso3166: ISO3166): void => {
      dispatch(statsISO3166Selected(iso3166));
    },
    itemNameTyped: (name: StatsItemName): void => {
      dispatch(itemNameTyped(name));
    },
    saveNewItem: (): void => {
      dispatch(saveItem());
    },
    rowSelected: (row: Row): void => {
      dispatch(rowSelected(row));
    },
    selectingItemNameTyped: (name: StatsItemName): void => {
      dispatch(selectingItemNameTyped(name));
    },
    startDateDetermined: (startDate: AsOf): void => {
      dispatch(startDateDetermined(startDate));
    },
    invalidDateInput: (): void => {
      dispatch(invalidDateInput());
    },
    rowMoved: (column: Column, target: Column): void => {
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
