import * as React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import NotFound from './NotFound';
import {Endpoints} from '../Endpoints';

export default class Catalogue extends React.Component<{}, {}> {

  public shouldComponentUpdate(nextProps: {}, nextState: {}): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <Switch>
        <Route exact={true} path={Endpoints.NOTFOUND} component={NotFound} />
      </Switch>
    );
  }
}
