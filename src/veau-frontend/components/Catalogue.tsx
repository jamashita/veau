import * as React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { CaptionList } from '../containers/page/CaptionList';
import { Entrance } from '../containers/page/Entrance';
import { Endpoints } from '../Endpoints';
import { NotFound } from './page/NotFound';

type Props = {
};
type State = {
};

export class Catalogue extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
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
