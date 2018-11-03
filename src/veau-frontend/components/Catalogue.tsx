import * as React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import NotFound from './NotFound';
import {Endpoints} from '../Endpoints';
import Entrance from '../containers/entrance/Entrance';

type Props = {
}
type State = {
}

export default class Catalogue extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <Switch>
        <Route exact={true} path={Endpoints.ENTRANCE} component={Entrance} />
        <Route exact={true} path={Endpoints.NOTFOUND} component={NotFound} />
      </Switch>
    );
  }
}
