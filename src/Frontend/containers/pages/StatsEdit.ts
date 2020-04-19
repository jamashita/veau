import { createMatchSelector, matchSelectorFn, RouterRootState } from 'connected-react-router';
import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { match } from 'react-router-dom';
import { Dispatch } from 'redux';
import { Stats } from '../../../Entity/Stats';
import { StatsItem } from '../../../Entity/StatsItem';
import { Quantum } from '../../../General/Quantum/Quantum';
import { Nullable } from '../../../General/Type/Value';
import { AsOf } from '../../../VO/AsOf';
import { Column } from '../../../VO/Column';
import { Coordinate } from '../../../VO/Coordinate';
import { ISO3166 } from '../../../VO/ISO3166';
import { ISO639 } from '../../../VO/ISO639';
import { Locale } from '../../../VO/Locale';
import { NumericalValue } from '../../../VO/NumericalValue';
import { Row } from '../../../VO/Row';
import { StatsID } from '../../../VO/StatsID';
import { StatsItemName } from '../../../VO/StatsItemName';
import { StatsName } from '../../../VO/StatsName';
import { StatsUnit } from '../../../VO/StatsUnit';
import { Action } from '../../actions/Action';
import {
  initFailed,
  initStatsEdit,
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
import { Endpoints } from '../../Endpoints';
import { State } from '../../State';

type MatchParam = Readonly<{
  id: string;
}>;
type StateProps = Readonly<{
  stats: Stats;
  statsItem: StatsItem;
  selectingItem: Quantum<StatsItem>;
  locale: Locale;
  id: Nullable<string>;
}>;
type DispatchProps = Readonly<{
  initialize: (statsID: StatsID) => void;
  invalidIDInput: () => void;
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
}>;
type OwnProps = Readonly<{}>;
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  const {
    stats,
    statsItem,
    statsEdit: {
      selectingItem
    },
    locale
  } = state;

  const selector: matchSelectorFn<RouterRootState, MatchParam> = createMatchSelector<RouterRootState, MatchParam>(Endpoints.STATS_EDIT);
  const matchParam: Nullable<match<MatchParam>> = selector(state);

  if (matchParam === null) {
    return {
      stats,
      statsItem,
      selectingItem,
      locale,
      id: null
    };
  }

  return {
    stats,
    statsItem,
    selectingItem,
    locale,
    id: matchParam.params.id
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>) => {
  return {
    initialize: (statsID: StatsID) => {
      dispatch(initStatsEdit(statsID));
    },
    invalidIDInput: () => {
      dispatch(initFailed());
    },
    dataFilled: (coordinate: Coordinate, value: NumericalValue) => {
      dispatch(statsDataFilled(coordinate, value));
    },
    dataDeleted: (coordinate: Coordinate) => {
      dispatch(statsDataDeleted(coordinate));
    },
    nameTyped: (name: StatsName) => {
      dispatch(statsNameTyped(name));
    },
    unitTyped: (unit: StatsUnit) => {
      dispatch(statsUnitTyped(unit));
    },
    iso639Selected: (iso639: ISO639) => {
      dispatch(statsISO639Selected(iso639));
    },
    iso3166Selected: (iso3166: ISO3166) => {
      dispatch(statsISO3166Selected(iso3166));
    },
    itemNameTyped: (name: StatsItemName) => {
      dispatch(itemNameTyped(name));
    },
    saveNewItem: () => {
      dispatch(saveItem());
    },
    rowSelected: (row: Row) => {
      dispatch(rowSelected(row));
    },
    selectingItemNameTyped: (name: StatsItemName) => {
      dispatch(selectingItemNameTyped(name));
    },
    startDateDetermined: (startDate: AsOf) => {
      dispatch(startDateDetermined(startDate));
    },
    invalidDateInput: () => {
      dispatch(invalidDateInput());
    },
    rowMoved: (column: Column, target: Column) => {
      dispatch(rowMoved(column, target));
    },
    invalidValueInput: () => {
      dispatch(invalidValueInput());
    },
    removeItem: (statsItem: StatsItem) => {
      dispatch(removeItem(statsItem));
    },
    save: () => {
      dispatch(saveStats());
    }
  };
};

export const StatsEdit: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps, mapDispatchToProps)(Component);
