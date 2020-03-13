import { Button, Icon } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Props } from '../../containers/pages/StatsList';
import { Authenticated } from '../../containers/templates/Authenticated';
import { StatsOutlineListTable } from '../molecules/StatsOutlineListTable';
import { StatsOutlineModal } from '../molecules/StatsOutlineModal';

type State = {
};

class StatsListImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
    const {
      statsOutlines,
      open,
      stats,
      locale
    } = this.props;

    if (!statsOutlines.equals(nextProps.statsOutlines)) {
      return true;
    }
    if (open !== nextProps.open) {
      return true;
    }
    if (!stats.isSame(nextProps.stats)) {
      return true;
    }
    if (!locale.equals(nextProps.locale)) {
      return true;
    }

    return false;
  }

  public componentDidMount(): void {
    const {
      initialize
    } = this.props;

    initialize();
  }

  public render(): React.ReactNode {
    const {
      statsOutlines,
      open,
      stats,
      locale,
      intl,
      newStatsClicked,
      toStatsEdit,
      closeNewStatsModal,
      nameTyped,
      unitTyped,
      iso639Selected,
      iso3166Selected,
      termSelected,
      saveNewStats
    } = this.props;

    return (
      <Authenticated>
        <Button
          variant='contained'
          color='primary'
          onClick={newStatsClicked}
        >
          <Icon
            className='fas fa-plus-circle icon-spacing'
          />
          {intl.formatMessage({
            id: 'CREATE_NEW_STATS'
          })}
        </Button>
        <StatsOutlineListTable
          statsOutlines={statsOutlines}
          toStatsEdit={toStatsEdit}
        />
        <StatsOutlineModal
          open={open}
          stats={stats}
          locale={locale}
          closeNewStatsModal={closeNewStatsModal}
          nameTyped={nameTyped}
          unitTyped={unitTyped}
          iso639Selected={iso639Selected}
          iso3166Selected={iso3166Selected}
          termSelected={termSelected}
          saveNewStats={saveNewStats}
        />
      </Authenticated>
    );
  }
}

export const StatsList: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(StatsListImpl);
