import { Button, Icon } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { StatsDisplay } from '../../../VO/Display/StatsDisplay';
import { ISO639 } from '../../../VO/Language/ISO639';
import { Locale } from '../../../VO/Locale/Locale';
import { ISO3166 } from '../../../VO/Region/ISO3166';
import { StatsListItems } from '../../../VO/StatsListItem/StatsListItems';
import { StatsID } from '../../../VO/StatsOutline/StatsID';
import { StatsName } from '../../../VO/StatsOutline/StatsName';
import { StatsUnit } from '../../../VO/StatsOutline/StatsUnit';
import { Term } from '../../../VO/Term/Term';
import { Authenticated } from '../../Container/Template/Authenticated';
import { StatsOutlineListTable } from '../Molecule/StatsOutlineListTable';
import { StatsOutlineModal } from '../Molecule/StatsOutlineModal';

export type StateProps = Readonly<{
  statsListItems: StatsListItems;
  open: boolean;
  stats: StatsDisplay;
  locale: Locale;
}>;
export type DispatchProps = Readonly<{
  initialize(): void;
  toStatsEdit(statsID: StatsID): void;
  newStatsClicked(): void;
  closeNewStatsModal(): void;
  nameTyped(name: StatsName): void;
  unitTyped(unit: StatsUnit): void;
  iso639Selected(iso639: ISO639): void;
  iso3166Selected(iso3166: ISO3166): void;
  termSelected(term: Term): void;
  saveNewStats(): void;
}>;
export type OwnProps = Readonly<{}>;
type Props = StateProps & DispatchProps & OwnProps;
type State = Readonly<{}>;

class StatsListImpl extends React.Component<Props & WrappedComponentProps, State> {
  public componentDidMount(): void {
    // prettier-ignore
    const {
      initialize
    } = this.props;

    initialize();
  }

  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    // prettier-ignore
    const {
      statsListItems,
      open,
      stats,
      locale
    } = this.props;

    if (!statsListItems.equals(nextProps.statsListItems)) {
      return true;
    }
    if (open !== nextProps.open) {
      return true;
    }
    if (!stats.equals(nextProps.stats)) {
      return true;
    }
    if (!locale.equals(nextProps.locale)) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      statsListItems,
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
        <Button variant='contained' color='primary' onClick={newStatsClicked}>
          <Icon className='fas fa-plus-circle icon-spacing'/>
          {intl.formatMessage({
            id: 'CREATE_NEW_STATS'
          })}
        </Button>
        <StatsOutlineListTable statsListItems={statsListItems} toStatsEdit={toStatsEdit}/>
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
