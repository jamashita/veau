import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Entrance } from '../containers/pages/Entrance';
import { StatsEdit } from '../containers/pages/StatsEdit';
import { StatsList } from '../containers/pages/StatsList';
import { Endpoints } from '../Endpoints';
import { NotFound } from './pages/NotFound';

type Props = Readonly<{
}>;
type State = Readonly<{
}>;

export class Catalogue extends React.Component<Props, State> {

  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <Switch>
        <Route
          exact={true}
          path={Endpoints.ENTRANCE}
          component={Entrance}
        />
        <Route
          exact={true}
          path={Endpoints.STATS_LIST}
          component={StatsList}
        />
        <Route
          exact={true}
          path={Endpoints.STATS_EDIT}
          component={StatsEdit}
        />
        <Route
          exact={true}
          path={Endpoints.NOTFOUND}
          component={NotFound}
        />
      </Switch>
    );
  }
}
