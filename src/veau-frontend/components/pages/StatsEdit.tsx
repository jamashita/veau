import { HotTable } from '@handsontable/react';
import {
  Button,
  Icon
} from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Props } from '../../containers/pages/StatsEdit';
import { Authenticated } from '../../containers/templates/Authenticated';
import { StatsInformation } from '../molecules/StatsInformation';
import { StatsItemInformation } from '../molecules/StatsItemInformation';
import { StatsItemModal } from '../molecules/StatsItemModal';

type State = {
  openNewStatsItemModal: boolean;
};

const ROW_INDEX: number = 0;
const COLUMN_INDEX: number = 1;
const VALUE_INDEX: number = 3;

export class StatsEditImpl extends React.Component<Props & InjectedIntlProps, State> {

  public constructor(props: Props & InjectedIntlProps) {
    super(props);
    this.state = {
      openNewStatsItemModal: false
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
      openNewStatsItemModal
    } = this.state;

    if (!stats.getLanguage().equals(nextProps.stats.getLanguage())) {
      return true;
    }
    if (!stats.getRegion().equals(nextProps.stats.getRegion())) {
      return true;
    }
    if (!stats.getTerm().equals(nextProps.stats.getTerm())) {
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
    if (openNewStatsItemModal !== nextState.openNewStatsItemModal) {
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
      intl
    } = this.props;
    const {
      openNewStatsItemModal
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
            colHeaders={stats.getColumn()}
            rowHeaders={stats.getRow()}
            rowHeaderWidth={stats.getRowHeaderSize()}
            manualRowResize={true}
            manualColumnResize={true}
            autoColumnSize={true}
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
              const length: number = changes.length;
              for (let i: number = 0; i < length; i++) {
                const str: string = changes[i][VALUE_INDEX];
                const row: number = changes[i][ROW_INDEX];
                const column: number = changes[i][COLUMN_INDEX];

                if (str === '') {
                  this.props.dataDeleted(row, column);
                  continue;
                }

                const value: number = Number(str);
                this.props.dataFilled(row, column, value);
              }
            }}
            afterSelection={(row1: number, col1: number, row2: number, col2: number): void => {
              if (row1 === row2) {
                this.props.rowSelected(row1);
              }
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
          closeNewItemModal={(): void => {
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
      </Authenticated>
    );
  }
}

export const StatsEdit: React.ComponentClass<Props, State> = injectIntl(StatsEditImpl);
