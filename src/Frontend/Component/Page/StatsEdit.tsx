import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { Absent, Quantum, Superposition } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { Button, Icon } from '@material-ui/core';

import { Stats } from '../../../Entity/Stats/Stats';
import { StatsItem } from '../../../Entity/StatsItem/StatsItem';
import { AsOf } from '../../../VO/AsOf/AsOf';
import { AsOfError } from '../../../VO/AsOf/Error/AsOfError';
import { Column } from '../../../VO/Coordinate/Column';
import { Coordinate } from '../../../VO/Coordinate/Coordinate';
import { Row } from '../../../VO/Coordinate/Row';
import { ISO639 } from '../../../VO/Language/ISO639';
import { Locale } from '../../../VO/Locale/Locale';
import { NumericalValue } from '../../../VO/NumericalValue/NumericalValue';
import { ISO3166 } from '../../../VO/Region/ISO3166';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';
import { StatsID } from '../../../VO/StatsOutline/StatsID';
import { StatsName } from '../../../VO/StatsOutline/StatsName';
import { StatsUnit } from '../../../VO/StatsOutline/StatsUnit';
import { Authenticated } from '../../Container/Template/Authenticated';
import { Chart } from '../Molecule/Chart';
import { Spreadsheet } from '../Molecule/Spreadsheet';
import { StatsEditStartDateModal } from '../Molecule/StatsEditStartDateModal';
import { StatsInformation } from '../Molecule/StatsInformation';
import { StatsItemInformation } from '../Molecule/StatsItemInformation';
import { StatsItemModal } from '../Molecule/StatsItemModal';

export type StateProps = Readonly<{
  stats: Stats;
  statsItem: StatsItem;
  selectingItem: Quantum<StatsItem>;
  locale: Locale;
  id: Nullable<string>;
}>;
export type DispatchProps = Readonly<{
  initialize(statsID: StatsID): void;
  invalidIDInput(): void;
  dataFilled(coordinate: Coordinate, value: NumericalValue): void;
  dataDeleted(coordinate: Coordinate): void;
  nameTyped(name: StatsName): void;
  unitTyped(unit: StatsUnit): void;
  iso639Selected(iso639: ISO639): void;
  iso3166Selected(iso3166: ISO3166): void;
  itemNameTyped(name: StatsItemName): void;
  saveNewItem(): void;
  rowSelected(row: Row): void;
  selectingItemNameTyped(name: StatsItemName): void;
  startDateDetermined(startDate: AsOf): void;
  invalidDateInput(): void;
  rowMoved(column: Column, target: Column): void;
  invalidValueInput(): void;
  removeItem(statsItem: StatsItem): void;
  save(): void;
}>;
export type OwnProps = Readonly<{}>;
type Props = StateProps & DispatchProps & OwnProps;
type State = Readonly<{
  openNewStatsItemModal: boolean;
  openStartDateModal: boolean;
  startDate: Quantum<AsOf>;
}>;

export class StatsEditImpl extends React.Component<Props & WrappedComponentProps, State> {
  public constructor(props: Props & WrappedComponentProps) {
    super(props);

    this.state = {
      openNewStatsItemModal: false,
      openStartDateModal: false,
      startDate: Absent.of<AsOf>()
    };
  }

  public componentDidMount(): void {
    // prettier-ignore
    const {
      id,
      initialize,
      invalidIDInput
    } = this.props;

    if (id === null) {
      invalidIDInput();

      return;
    }

    StatsID.ofString(id).transform<void>(
      (statsID: StatsID) => {
        initialize(statsID);
      },
      () => {
        invalidIDInput();
      }
    );
  }

  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps, nextState: State): boolean {
    // prettier-ignore
    const {
      stats,
      statsItem,
      selectingItem,
      locale
    } = this.props;
    // prettier-ignore
    const {
      openNewStatsItemModal,
      openStartDateModal,
      startDate
    } = this.state;

    if (!stats.isSame(nextProps.stats)) {
      return true;
    }
    if (!statsItem.isSame(nextProps.statsItem)) {
      return true;
    }
    if (!locale.equals(nextProps.locale)) {
      return true;
    }
    if (openNewStatsItemModal !== nextState.openNewStatsItemModal) {
      return true;
    }
    if (openStartDateModal !== nextState.openStartDateModal) {
      return true;
    }
    if (startDate !== nextState.startDate) {
      return true;
    }
    if (selectingItem !== nextProps.selectingItem) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      stats,
      statsItem,
      selectingItem,
      locale,
      intl,
      invalidValueInput,
      dataDeleted,
      dataFilled,
      rowSelected,
      rowMoved,
      save,
      nameTyped,
      unitTyped,
      iso639Selected,
      iso3166Selected,
      selectingItemNameTyped,
      removeItem,
      itemNameTyped,
      saveNewItem,
      startDateDetermined,
      invalidDateInput
    } = this.props;
    // prettier-ignore
    const {
      openNewStatsItemModal,
      openStartDateModal
    } = this.state;

    return (
      <Authenticated>
        <div className='stats-items-edit'>
          <Chart stats={stats} />
          <Spreadsheet
            stats={stats}
            invalidValueInput={invalidValueInput}
            dataDeleted={dataDeleted}
            dataFilled={dataFilled}
            rowSelected={rowSelected}
            rowMoved={rowMoved}
          />
        </div>
        <div className='stats-edit'>
          <Button
            color='primary'
            fullWidth={true}
            onClick={() => {
              this.setState({
                openNewStatsItemModal: true
              });
            }}
          >
            <Icon className='fas fa-plus-square' />
            {intl.formatMessage({
              id: 'ADD_ITEM'
            })}
          </Button>
          <Button
            color='primary'
            fullWidth={true}
            disabled={stats.isDetermined()}
            onClick={() => {
              this.setState({
                openStartDateModal: true
              });
            }}
          >
            <Icon className='fas fa-hourglass' />
            {intl.formatMessage({
              id: 'DETERMINE_START_DATE'
            })}
          </Button>
          <Button color='primary' fullWidth={true} disabled={!stats.isValid()} onClick={save}>
            <Icon className='fas fa-save' />
            {intl.formatMessage({
              id: 'SAVE'
            })}
          </Button>
          <StatsInformation
            stats={stats}
            locale={locale}
            nameTyped={nameTyped}
            unitTyped={unitTyped}
            iso639Selected={iso639Selected}
            iso3166Selected={iso3166Selected}
          />
          <StatsItemInformation selecting={selectingItem} nameTyped={selectingItemNameTyped} removeItem={removeItem} />
        </div>
        <StatsItemModal
          open={openNewStatsItemModal}
          statsItem={statsItem}
          close={() => {
            this.setState({
              openNewStatsItemModal: false
            });
          }}
          itemNameTyped={itemNameTyped}
          saveNewItem={() => {
            this.setState({
              openNewStatsItemModal: false
            });
            saveNewItem();
          }}
        />
        <StatsEditStartDateModal
          open={openStartDateModal}
          close={() => {
            this.setState({
              openStartDateModal: false
            });
          }}
          determineStartDate={(superposition: Superposition<AsOf, AsOfError>) => {
            superposition.transform<void>(
              (asOf: AsOf) => {
                startDateDetermined(asOf);
              },
              () => {
                invalidDateInput();
              }
            );

            this.setState({
              openStartDateModal: false
            });
          }}
        />
      </Authenticated>
    );
  }
}

export const StatsEdit: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(StatsEditImpl);
