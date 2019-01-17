import * as React from 'react';
import {Catalogue} from './Catalogue';
import {Modal} from '../containers/page/Modal';
import {LoadingIndicator} from '../containers/page/LoadingIndicator';

type Props = {
};
type State = {
};

export class MainView extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <div>
        <Catalogue />
        <Modal />
        <LoadingIndicator />
      </div>
    );
  }
}
