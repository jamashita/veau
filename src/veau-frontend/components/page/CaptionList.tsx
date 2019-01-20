import { Button } from '@material-ui/core';
import * as React from 'react';
import { PageProvider } from '../../containers/molecules/PageProvider';
import { Props } from '../../containers/page/CaptionList';

type State = {
};

export class CaptionList extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    return true;
  }

  public render(): React.ReactNode {

    return (
      <div>
        <PageProvider/>
        <Button
          onClick={this.props.open}
        >
          OPEN
        </Button>
      </div>
    );
  }
}
