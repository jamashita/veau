import { Button, Icon } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { AsOf } from '../../../VO/AsOf';
import { StatsID } from '../../../VO/StatsID';
import { Props } from '../../containers/pages/StatsEdit';
import { Authenticated } from '../../containers/templates/Authenticated';
import { Chart } from '../molecules/Chart';
import { Spreadsheet } from '../molecules/Spreadsheet';
import { StatsEditStartDateModal } from '../molecules/StatsEditStartDateModal';
import { StatsInformation } from '../molecules/StatsInformation';
import { StatsItemInformation } from '../molecules/StatsItemInformation';
import { StatsItemModal } from '../molecules/StatsItemModal';

type State = Readonly<{
  openNewStatsItemModal: boolean;
  openStartDateModal: boolean;
  startDate?: string;
}>;

export class StatsEditImpl extends React.Component<Props & WrappedComponentProps, State> {

  public constructor(props: Props & WrappedComponentProps) {
    super(props);

    this.state = {
      openNewStatsItemModal: false,
      openStartDateModal: false
    };
  }

  public componentDidMount(): void {
    const {
      id,
      initialize,
      invalidIDInput
    } = this.props;

    if (id === null) {
      invalidIDInput();
      return;
    }

    StatsID.ofString(id).match<void>((statsID: StatsID) => {
      initialize(statsID);
    }, () => {
      invalidIDInput();
    });
  }

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>, nextState: Readonly<State>): boolean {
    const {
      stats,
      statsItem,
      selectingItem,
      locale
    } = this.props;
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
    if (selectingItem !== undefined) {
      if (nextProps.selectingItem !== undefined) {
        if (selectingItem.isSame(nextProps.selectingItem)) {
          return false;
        }

        return true;
      }

      return true;
    }
    if (nextProps.selectingItem !== undefined) {
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
            stats={stats}
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
            onClick={() => {
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
            disabled={stats.isDetermined()}
            onClick={() => {
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
            locale={locale}
            nameTyped={nameTyped}
            unitTyped={unitTyped}
            iso639Selected={iso639Selected}
            iso3166Selected={iso3166Selected}
          />
          <StatsItemInformation
            selecting={selectingItem}
            nameTyped={selectingItemNameTyped}
            removeItem={removeItem}
          />
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
          determineStartDate={(date: string) => {
            AsOf.ofString(date).match<void>((asOf: AsOf) => {
              startDateDetermined(asOf);
            }, () => {
              invalidDateInput();
            });

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
