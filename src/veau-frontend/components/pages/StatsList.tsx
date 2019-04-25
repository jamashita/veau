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
      open,
      stats,
      languages,
      regions
    } = this.props;

    const length: number = statsOverviews.length;
    if (length !== nextProps.statsOverviews.length) {
      return true;
    }
    for (let i: number = 0; i < length; i++) {
      if (statsOverviews[i].getName() !== nextProps.statsOverviews[i].getName()) {
        return true;
      }
      if (statsOverviews[i].getUnit() !== nextProps.statsOverviews[i].getUnit()) {
        return true;
      }
      if (!statsOverviews[i].getLanguage().equals(nextProps.statsOverviews[i].getLanguage())) {
        return true;
      }
      if (!statsOverviews[i].getRegion().equals(nextProps.statsOverviews[i].getRegion())) {
        return true;
      }
      if (statsOverviews[i].getTerm() !== nextProps.statsOverviews[i].getTerm()) {
        return true;
      }
      if (!statsOverviews[i].getUpdatedAt().isSame(nextProps.statsOverviews[i].getUpdatedAt())) {
        return true;
      }
    }
    if (open !== nextProps.open) {
      return true;
    }
    if (stats.getName() !== nextProps.stats.getName()) {
      return true;
    }
    if (stats.getUnit() !== nextProps.stats.getUnit()) {
      return true;
    }
    if (!stats.getLanguage().equals(nextProps.stats.getLanguage())) {
      return true;
    }
    if (!stats.getRegion().equals(nextProps.stats.getRegion())) {
      return true;
    }
    if (stats.getTerm() !== nextProps.stats.getTerm()) {
      return true;
    }
    if (languages.length !== nextProps.languages.length) {
      return true;
    }
    if (regions.length !== nextProps.regions.length) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      statsOverviews,
      open,
      stats,
      languages,
      regions,
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
        <StatsOverviewListTable
          statsOverviews={statsOverviews}
          toStatsEdit={toStatsEdit}
        />
        <StatsOverviewModal
          open={open}
          stats={stats}
          languages={languages}
          regions={regions}
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
