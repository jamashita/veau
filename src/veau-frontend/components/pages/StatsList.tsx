import { Button, Icon } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Props } from '../../containers/pages/StatsList';
import { Authenticated } from '../../containers/templates/Authenticated';
import { StatsOutlineListTable } from '../molecules/StatsOutlineListTable';
import { StatsOutlineModal } from '../molecules/StatsOutlineModal';

type State = {
};

class StatsListImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      statsOutlines,
      open,
      stats,
      locale
    } = this.props;

    const length: number = statsOutlines.length();
    if (length !== nextProps.statsOutlines.length()) {
      return true;
    }
    for (let i: number = 0; i < length; i++) {
      if (!statsOutlines.get(i).getName().equals(nextProps.statsOutlines.get(i).getName())) {
        return true;
      }
      if (!statsOutlines.get(i).getUnit().equals(nextProps.statsOutlines.get(i).getUnit())) {
        return true;
      }
      if (!statsOutlines.get(i).getLanguage().equals(nextProps.statsOutlines.get(i).getLanguage())) {
        return true;
      }
      if (!statsOutlines.get(i).getRegion().equals(nextProps.statsOutlines.get(i).getRegion())) {
        return true;
      }
      if (statsOutlines.get(i).getTerm() !== nextProps.statsOutlines.get(i).getTerm()) {
        return true;
      }
      if (!statsOutlines.get(i).getUpdatedAt().equals(nextProps.statsOutlines.get(i).getUpdatedAt())) {
        return true;
      }
    }
    if (open !== nextProps.open) {
      return true;
    }
    if (!stats.getName().equals(nextProps.stats.getName())) {
      return true;
    }
    if (!stats.getUnit().equals(nextProps.stats.getUnit())) {
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
    if (locale.getLanguages().length() !== nextProps.locale.getLanguages().length()) {
      return true;
    }
    if (locale.getRegions().length() !== nextProps.locale.getRegions().length()) {
      return true;
    }

    return false;
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

export const StatsList: React.ComponentClass<Props, State> = injectIntl(StatsListImpl);
