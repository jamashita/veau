import * as React from 'react';
import { PageProvider } from '../../containers/molecules/PageProvider';
import { Props } from '../../containers/templates/Authenticated';
import { Header } from '../molecules/Header';

type State = {
};

export class Authenticated extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      children
    } = this.props;

    return (
      <div>
        <Header
          menuClicked={this.props.menuClicked}
        />
        <PageProvider />
        {children}
      </div>
    );
  }
}
