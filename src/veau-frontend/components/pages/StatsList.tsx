import { Button, Icon } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Props } from '../../containers/pages/StatsList';
import { Authenticated } from '../../containers/templates/Authenticated';
import { StatsOverviewListTable } from '../molecules/StatsOverviewListTable';
import { StatsOverviewModal } from '../molecules/StatsOverviewModal';

type State = {
};

class StatsListImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      statsOverviews,
      localeQuery,
      open,
      newStatsOverview
    } = this.props;

    const length: number = statsOverviews.length;
    if (length !== nextProps.statsOverviews.length) {
      return true;
    }
    for (let i: number = 0; i < length; i++) {
      if (!statsOverviews[i].equals(nextProps.statsOverviews[i])) {
        return true;
      }
    }
    if (localeQuery !== nextProps.localeQuery) {
      return true;
    }
    if (open !== nextProps.open) {
      return true;
    }
    if (newStatsOverview.getName() !== nextProps.newStatsOverview.getName()) {
      return true;
    }
    if (newStatsOverview.getUnit() !== nextProps.newStatsOverview.getUnit()) {
      return true;
    }
    if (!newStatsOverview.getISO639().equals(nextProps.newStatsOverview.getISO639())) {
      return true;
    }
    if (!newStatsOverview.getISO3166().equals(nextProps.newStatsOverview.getISO3166())) {
      return true;
    }
    if (newStatsOverview.getTerm() !== nextProps.newStatsOverview.getTerm()) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      statsOverviews,
      localeQuery,
      open,
      newStatsOverview,
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
          <Icon className='fas fa-plus-circle icon-spacing' />
          {intl.formatMessage({
            id: 'CREATE_NEW_STATS'
          })}
        </Button>
        <StatsOverviewListTable
          statsOverviews={statsOverviews}
          localeQuery={localeQuery}
          toStatsEdit={toStatsEdit}
        />
        <StatsOverviewModal
          open={open}
          newStatsOverview={newStatsOverview}
          languages={localeQuery.allLanguages()}
          regions={localeQuery.allRegions()}
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

export const StatsList: React.ComponentClass<Props, State> = injectIntl(StatsListImpl);
