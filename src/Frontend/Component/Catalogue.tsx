import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Entrance } from '../Container/Page/Entrance';
import { StatsEdit } from '../Container/Page/StatsEdit';
import { StatsList } from '../Container/Page/StatsList';
import { Endpoints } from '../Endpoints';
import { NotFound } from './Page/NotFound';

type Props = Readonly<{}>;
type State = Readonly<{}>;

export class Catalogue extends React.Component<Props, State> {
  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <Switch>
        <Route exact={true} path={Endpoints.ENTRANCE} component={Entrance} />
        <Route exact={true} path={Endpoints.STATS_LIST} component={StatsList} />
        <Route exact={true} path={Endpoints.STATS_EDIT} component={StatsEdit} />
        <Route exact={true} path={Endpoints.NOTFOUND} component={NotFound} />
      </Switch>
    );
  }
}
