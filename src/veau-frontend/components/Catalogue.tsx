import * as React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import NotFound from './NotFound';
import {Endpoints} from '../Endpoints';
import Entrance from '../containers/entrance/Entrance';
import {CaptionList} from './caption/list/CaptionList';

type Props = {
}

export default class Catalogue extends React.Component<Props, {}> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <Switch>
        <Route exact={true} path={Endpoints.ENTRANCE} component={Entrance} />
        <Route exact={true} path={Endpoints.HOME} component={CaptionList} />
        <Route exact={true} path={Endpoints.NOTFOUND} component={NotFound} />
      </Switch>
    );
  }
}
