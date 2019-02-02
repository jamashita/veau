import {
  Button,
  Icon
} from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Props } from '../../containers/pages/StatsEdit';
import { Authenticated } from '../../containers/templates/Authenticated';
import { Chart } from '../molecules/Chart';
import { Spreadsheet } from '../molecules/Spreadsheet';
import { StatsEditStartDateModal } from '../molecules/StatsEditStartDateModal';
import { StatsInformation } from '../molecules/StatsInformation';
import { StatsItemInformation } from '../molecules/StatsItemInformation';
import { StatsItemModal } from '../molecules/StatsItemModal';

type State = {
  openNewStatsItemModal: boolean;
  openStartDateModal: boolean;
  startDate?: string;
};

export class StatsEditImpl extends React.Component<Props & InjectedIntlProps, State> {

  public constructor(props: Props & InjectedIntlProps) {
    super(props);

    this.state = {
      openNewStatsItemModal: false,
      openStartDateModal: false
    };
  }

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>, nextState: Readonly<State>): boolean {
    const {
      stats,
      statsItem,
      localeRepository,
      selectingItem
    } = this.props;
    const {
      openNewStatsItemModal,
      openStartDateModal,
      startDate
    } = this.state;

    if (!stats.getLanguage().equals(nextProps.stats.getLanguage())) {
      return true;
    }
    if (!stats.getRegion().equals(nextProps.stats.getRegion())) {
      return true;
    }
    if (stats.getTerm() !== nextProps.stats.getTerm()) {
      return true;
    }
    if (stats.getItems().length !== nextProps.stats.getItems().length) {
      return true;
    }
    if (stats !== nextProps.stats) {
      return true;
    }
    if (statsItem.getName() !== nextProps.statsItem.getName()) {
      return true;
    }
    if (statsItem.getUnit() !== nextProps.statsItem.getUnit()) {
      return true;
    }
    if (localeRepository !== nextProps.localeRepository) {
      return true;
    }
    if (selectingItem !== nextProps.selectingItem) {
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

    return false;
  }

  public render(): React.ReactNode {
    const {
      stats,
      statsItem,
      localeRepository,
      selectingItem,
      intl,
      invalidValueInput,
      dataDeleted,
      dataFilled,
      rowSelected,
      rowMoved,
      save,
      nameTyped,
      languageSelected,
      regionSelected,
      selectingItemNameTyped,
      selectingItemUnitTyped,
      removeItem,
      itemNameTyped,
      itemUnitTyped,
      saveNewItem,
      startDateDetermined
    } = this.props;
    const {
      openNewStatsItemModal,
      openStartDateModal
    } = this.state;

    return (
      <Authenticated>
        <div
          className='stats-items-edit'
        >
          <Chart
            stats={stats}
          />
          <Spreadsheet
            data={stats.getData()}
            columnHeaders={stats.getColumns()}
            rowHeaders={stats.getRows()}
            rowHeaderWidth={stats.getRowHeaderSize()}
            invalidValueInput={invalidValueInput}
            dataDeleted={dataDeleted}
            dataFilled={dataFilled}
            rowSelected={rowSelected}
            rowMoved={rowMoved}
          />
        </div>
        <div
          className='stats-edit'
        >
          <Button
            color='primary'
            fullWidth={true}
            onClick={(): void => {
              this.setState({
                openNewStatsItemModal: true
              });
            }}
          >
            <Icon
              className='fas fa-plus-square'
            />
            {intl.formatMessage({
              id: 'ADD_ITEM'
            })}
          </Button>
          <Button
            color='primary'
            fullWidth={true}
            disabled={stats.hasValues() || stats.getStartDate() !== undefined}
            onClick={(): void => {
              this.setState({
                openStartDateModal: true
              });
            }}
          >
            <Icon
              className='fas fa-hourglass'
            />
            {intl.formatMessage({
              id: 'DETERMINE_START_DATE'
            })}
          </Button>
          <Button
            color='primary'
            fullWidth={true}
            disabled={!stats.isValid()}
            onClick={save}
          >
            <Icon
              className='fas fa-save'
            />
            {intl.formatMessage({
              id: 'SAVE'
            })}
          </Button>
          <StatsInformation
            stats={stats}
            localeRepository={localeRepository}
            nameTyped={nameTyped}
            languageSelected={languageSelected}
            regionSelected={regionSelected}
          />
          <StatsItemInformation
            selecting={selectingItem}
            nameTyped={selectingItemNameTyped}
            unitTyped={selectingItemUnitTyped}
            removeItem={removeItem}
          />
        </div>
        <StatsItemModal
          open={openNewStatsItemModal}
          statsItem={statsItem}
          close={(): void => {
            this.setState({
              openNewStatsItemModal: false
            });
          }}
          itemNameTyped={itemNameTyped}
          itemUnitTyped={itemUnitTyped}
          saveNewItem={(): void => {
            this.setState({
              openNewStatsItemModal: false
            });
            saveNewItem();
          }}
        />
        <StatsEditStartDateModal
          open={openStartDateModal}
          close={(): void => {
            this.setState({
              openStartDateModal: false
            });
          }}
          determineStartDate={(date: string): void => {
            startDateDetermined(date);
            this.setState({
              openStartDateModal: false
            });
          }}
        />
      </Authenticated>
    );
  }
}

export const StatsEdit: React.ComponentClass<Props, State> = injectIntl(StatsEditImpl);
