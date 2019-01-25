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
      localeRepository,
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
    if (localeRepository !== nextProps.localeRepository) {
      return true;
    }
    if (open !== nextProps.open) {
      return true;
    }
    if (newStatsOverview.getName() !== nextProps.newStatsOverview.getName()) {
      return true;
    }
    if (!newStatsOverview.getISO639().equals(nextProps.newStatsOverview.getISO639())) {
      return true;
    }
    if (!newStatsOverview.getISO3166().equals(nextProps.newStatsOverview.getISO3166())) {
      return true;
    }
    if (!newStatsOverview.getTerm().equals(nextProps.newStatsOverview.getTerm())) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      statsOverviews,
      localeRepository,
      open,
      newStatsOverview,
      intl
    } = this.props;

    return (
      <Authenticated>
        <Button
          variant='contained'
          color='primary'
          onClick={this.props.newStatsClicked}
        >
          <Icon className='fas fa-plus-circle' />
          {intl.formatMessage({
            id: 'CREATE_NEW_STATS'
          })}
        </Button>
        <StatsOverviewListTable
          statsOverviews={statsOverviews}
          localeRepository={localeRepository}
          toStatsEdit={this.props.toStatsEdit}
        />
        <StatsOverviewModal
          open={open}
          newStatsOverview={newStatsOverview}
          languages={localeRepository.allLanguages()}
          regions={localeRepository.allRegions()}
          closeNewStatsModal={this.props.closeNewStatsModal}
          nameTyped={this.props.nameTyped}
          iso639Selected={this.props.iso639Selected}
          iso3166Selected={this.props.iso3166Selected}
          termSelected={this.props.termSelected}
          saveNewStats={this.props.saveNewStats}
        />
      </Authenticated>
    );
  }
}

export const StatsList: React.ComponentClass<Props, State> = injectIntl(StatsListImpl);
