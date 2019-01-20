import { Button } from '@material-ui/core';
import * as React from 'react';
import { Props } from '../../containers/captionList/CaptionList';
import { PageProvider } from '../../containers/molecules/PageProvider';

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
        Happy Halloween!
      </div>
    );
  }
}
