import * as React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { Entrance } from '../containers/entrance/Entrance';
import { Endpoints } from '../Endpoints';
import { CaptionList } from './captionList/CaptionList';
import { NotFound } from './NotFound';

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
