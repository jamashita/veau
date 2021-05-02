import { Kind, Nullable } from '@jamashita/anden-type';
import { createMatchSelector, matchSelectorFn, RouterRootState } from 'connected-react-router';
import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { match } from 'react-router-dom';
import { Dispatch } from 'redux';
import { StatsItem } from '../../../domain/entity/StatsItem/StatsItem';
import { AsOf } from '../../../domain/vo/AsOf/AsOf';
import { Column } from '../../../domain/vo/Coordinate/Column';
import { Coordinate } from '../../../domain/vo/Coordinate/Coordinate';
import { Row } from '../../../domain/vo/Coordinate/Row';
import { ISO639 } from '../../../domain/vo/Language/ISO639';
import { NumericalValue } from '../../../domain/vo/NumericalValue/NumericalValue';
import { ISO3166 } from '../../../domain/vo/Region/ISO3166';
import { StatsItemName } from '../../../domain/vo/StatsItem/StatsItemName';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { StatsName } from '../../../domain/vo/StatsOutline/StatsName';
import { StatsUnit } from '../../../domain/vo/StatsOutline/StatsUnit';
import { VeauAction } from '../../Action';
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
} from '../../ActionCreator/StatsEditActionCreator';
import { DispatchProps, OwnProps, StateProps, StatsEdit as Component } from '../../Component/Page/StatsEdit';
import { Endpoints } from '../../Endpoints';
import { State } from '../../State';

type MatchParam = Readonly<{
  id: string;
}>;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  const {
    statsEdit: {
      stats,
      item,
      selectingItem
    },
    locale
  } = state;

  const selector: matchSelectorFn<RouterRootState, MatchParam> = createMatchSelector<RouterRootState, MatchParam>(Endpoints.STATS_EDIT);
  const matchParam: Nullable<match<MatchParam>> = selector(state);

  if (Kind.isNull(matchParam)) {
    return {
      stats,
      item,
      selectingItem,
      locale,
      id: null
    };
  }

  return {
    stats,
    item,
    selectingItem,
    locale,
    id: matchParam.params.id
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<VeauAction>) => {
  return {
    initialize(statsID: StatsID): void {
      dispatch(initStatsEdit(statsID));
    },
    invalidIDInput(): void {
      dispatch(initFailed());
    },
    dataFilled(coordinate: Coordinate, value: NumericalValue): void {
      dispatch(statsDataFilled(coordinate, value));
    },
    dataDeleted(coordinate: Coordinate): void {
      dispatch(statsDataDeleted(coordinate));
    },
    nameTyped(name: StatsName): void {
      dispatch(statsNameTyped(name));
    },
    unitTyped(unit: StatsUnit): void {
      dispatch(statsUnitTyped(unit));
    },
    iso639Selected(iso639: ISO639): void {
      dispatch(statsISO639Selected(iso639));
    },
    iso3166Selected(iso3166: ISO3166): void {
      dispatch(statsISO3166Selected(iso3166));
    },
    itemNameTyped(name: StatsItemName): void {
      dispatch(itemNameTyped(name));
    },
    saveNewItem(): void {
      dispatch(saveItem());
    },
    rowSelected(row: Row): void {
      dispatch(rowSelected(row));
    },
    selectingItemNameTyped(name: StatsItemName): void {
      dispatch(selectingItemNameTyped(name));
    },
    startDateDetermined(startDate: AsOf): void {
      dispatch(startDateDetermined(startDate));
    },
    invalidDateInput(): void {
      dispatch(invalidDateInput());
    },
    rowMoved(column: Column, target: Column): void {
      dispatch(rowMoved(column, target));
    },
    invalidValueInput(): void {
      dispatch(invalidValueInput());
    },
    removeItem(statsItem: StatsItem): void {
      dispatch(removeItem(statsItem));
    },
    save(): void {
      dispatch(saveStats());
    }
  };
};

export const StatsEdit: ConnectedComponent<typeof Component, StateProps> = connect<StateProps, DispatchProps, OwnProps, State>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
