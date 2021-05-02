import { Button, Icon } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { StatsDisplay } from '../../../domain/vo/Display/StatsDisplay';
import { ISO639 } from '../../../domain/vo/Language/ISO639';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { ISO3166 } from '../../../domain/vo/Region/ISO3166';
import { StatsListItems } from '../../../domain/vo/StatsListItem/StatsListItems';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { StatsName } from '../../../domain/vo/StatsOutline/StatsName';
import { StatsUnit } from '../../../domain/vo/StatsOutline/StatsUnit';
import { Term } from '../../../domain/vo/Term/Term';
import { Authenticated } from '../../Container/Template/Authenticated';
import { StatsOutlineListTable } from '../Molecule/StatsOutlineListTable';
import { StatsOutlineModal } from '../Molecule/StatsOutlineModal';

export type StateProps = Readonly<{
  items: StatsListItems;
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
type Props = DispatchProps & OwnProps & StateProps;
type State = Readonly<{}>;

class StatsListImpl extends React.Component<Props & WrappedComponentProps, State> {
  public componentDidMount(): void {
    const {
      initialize
    } = this.props;

    initialize();
  }

  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    const {
      items,
      open,
      stats,
      locale
    } = this.props;

    if (!items.equals(nextProps.items)) {
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
      items,
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
        <Button variant="contained" color="primary" onClick={newStatsClicked}>
          <Icon className="fas fa-plus-circle icon-spacing" />
          {intl.formatMessage({
            id: 'CREATE_NEW_STATS'
          })}
        </Button>
        <StatsOutlineListTable statsListItems={items} toStatsEdit={toStatsEdit} />
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

export const StatsList: React.ComponentType<WithIntlProps<Props>> = injectIntl(StatsListImpl);
