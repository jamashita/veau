import { HotTable } from '@handsontable/react';
import {
  Button,
  Icon, Snackbar
} from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Props } from '../../containers/pages/StatsEdit';
import { Authenticated } from '../../containers/templates/Authenticated';
import { StatsEditStartDateModal } from '../molecules/StatsEditStartDateModal';
import { StatsInformation } from '../molecules/StatsInformation';
import { StatsItemInformation } from '../molecules/StatsItemInformation';
import { StatsItemModal } from '../molecules/StatsItemModal';

type State = {
  openNewStatsItemModal: boolean;
  openStartDateModal: boolean;
  startDate?: string;
};

const ROW_INDEX: number = 0;
const COLUMN_INDEX: number = 1;
const VALUE_INDEX: number = 3;
const SPREADSHEET_HEIGHT: number = 500;
const DURATION: number = 3000;

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
      selectingItem,
      openSaveSuccessSnackbar
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
    for (let i: number = 0; i < stats.getItems().length; i++) {
      if (stats.getItems()[i].getValues().length() !== nextProps.stats.getItems()[i].getValues().length()) {
        return true;
      }
      for (let j: number = 0; j < stats.getItems()[i].getValues().length(); j++) {
        if (!stats.getItems()[i].getValues().get()[j].getAsOf().isSame(nextProps.stats.getItems()[i].getValues().get()[j].getAsOf())) {
          return true;
        }
        if (stats.getItems()[i].getValues().get()[j].getValue() !== nextProps.stats.getItems()[i].getValues().get()[j].getValue()) {
          return true;
        }
      }
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
    if (openSaveSuccessSnackbar !== nextProps.openSaveSuccessSnackbar) {
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
      openSaveSuccessSnackbar,
      intl
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
          <div>
            CHART COMES HERE
          </div>
          <HotTable
            data={stats.getData()}
            colHeaders={stats.getColumns()}
            rowHeaders={stats.getRows()}
            rowHeaderWidth={stats.getRowHeaderSize()}
            manualRowResize={true}
            manualColumnResize={true}
            manualRowMove={true}
            autoColumnSize={true}
            className='htRight'
            selectionMode='single'
            height={SPREADSHEET_HEIGHT}
            beforeChange={(changes: Array<Array<any>> | null): boolean => {
              if (!changes) {
                return false;
              }
              const length: number = changes.length;
              for (let i: number = 0; i < length; i++) {
                const str: string = changes[i][VALUE_INDEX];

                if (isNaN(Number(str))) {
                  return false;
                }
              }

              return true;
            }}
            afterChange={(changes: Array<Array<any>> | null): void => {
              if (!changes) {
                return;
              }
              changes.forEach((change: Array<any>) => {
                const str: string = change[VALUE_INDEX];
                const row: number = change[ROW_INDEX];
                const column: number = change[COLUMN_INDEX];

                if (str === '') {
                  this.props.dataDeleted(row, column);
                  return;
                }

                const value: number = Number(str);
                this.props.dataFilled(row, column, value);
              });
            }}
            afterSelection={(row1: number, col1: number, row2: number, col2: number): void => {
              if (row1 === row2) {
                this.props.rowSelected(row1);
              }
            }}
            beforeRowMove={(columns: Array<number>, target: number): boolean => {
              columns.forEach((column: number) => {
                if (column === target) {
                  return;
                }
                if (column < target) {
                  this.props.rowMoved(column, target - 1);
                  return;
                }
                this.props.rowMoved(column, target);
              });
              return true;
            }}
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
            onClick={this.props.save}
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
            nameTyped={this.props.nameTyped}
            languageSelected={this.props.languageSelected}
            regionSelected={this.props.regionSelected}
          />
          <StatsItemInformation
            selecting={selectingItem}
            nameTyped={this.props.selectingItemNameTyped}
            unitTyped={this.props.selectingItemUnitTyped}
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
          itemNameTyped={this.props.itemNameTyped}
          itemUnitTyped={this.props.itemUnitTyped}
          saveNewItem={(): void => {
            this.setState({
              openNewStatsItemModal: false
            });
            this.props.saveNewItem();
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
            this.props.startDateDetermined(date);
            this.setState({
              openStartDateModal: false
            });
          }}
        />
        <Snackbar
          open={openSaveSuccessSnackbar}
          autoHideDuration={DURATION}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          message={intl.formatMessage({
            id: 'SAVE_SUCCESS'
          })}
          onClose={this.props.closeSnackbar}
        />
      </Authenticated>
    );
  }
}

export const StatsEdit: React.ComponentClass<Props, State> = injectIntl(StatsEditImpl);
