import { Absent, Present } from '@jamashita/publikum-monad';
import { Kind, Nullable } from '@jamashita/publikum-type';
import { createMatchSelector, matchSelectorFn, RouterRootState } from 'connected-react-router';
import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { match } from 'react-router-dom';
import { Dispatch } from 'redux';

import { StatsItem } from '../../../Entity/StatsItem/StatsItem';
import { AsOf } from '../../../VO/AsOf/AsOf';
import { Column } from '../../../VO/Coordinate/Column';
import { Coordinate } from '../../../VO/Coordinate/Coordinate';
import { Row } from '../../../VO/Coordinate/Row';
import { ISO639 } from '../../../VO/Language/ISO639';
import { NumericalValue } from '../../../VO/NumericalValue/NumericalValue';
import { ISO3166 } from '../../../VO/Region/ISO3166';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';
import { StatsID } from '../../../VO/StatsOutline/StatsID';
import { StatsName } from '../../../VO/StatsOutline/StatsName';
import { StatsUnit } from '../../../VO/StatsOutline/StatsUnit';
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
  // prettier-ignore
  const {
    display: stats,
    statsItem,
    // prettier-ignore
    statsEdit: {
      selectingItem
    },
    locale
  } = state;

  const selector: matchSelectorFn<RouterRootState, MatchParam> = createMatchSelector<RouterRootState, MatchParam>(
    Endpoints.STATS_EDIT
  );
  const matchParam: Nullable<match<MatchParam>> = selector(state);

  if (Kind.isNull(matchParam)) {
    return {
      stats,
      statsItem,
      selectingItem,
      locale,
      id: Absent.of<string>()
    };
  }

  return {
    stats,
    statsItem,
    selectingItem,
    locale,
    id: Present.of<string>(matchParam.params.id)
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

export const StatsEdit: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps,
  DispatchProps,
  OwnProps,
  State>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
