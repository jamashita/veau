import * as React from 'react';
import { PageProvider } from '../../containers/molecules/PageProvider';
import { Props } from '../../containers/templates/Authenticated';
import { Header } from '../molecules/Header';

type State = {
};

export class Authenticated extends React.Component<Props, State> {

  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      children,
      menuClicked
    } = this.props;

    return (
      <div>
        <Header
          menuClicked={menuClicked}
        />
        <PageProvider/>
        {children}
      </div>
    );
  }
}
