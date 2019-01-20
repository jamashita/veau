import { Button, Drawer, Icon } from '@material-ui/core';
import * as React from 'react';
import { Props } from '../../containers/molecules/PageProvider';

type State = {
};

export class PageProvider extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const {
      isOpen
    } = this.props;

    if (isOpen !== nextProps.isOpen) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      isOpen
    } = this.props;

    return (
      <Drawer
        anchor='left'
        open={isOpen}
      >
        <Button
          variant='contained'
          color='primary'
          fullWidth={true}
          onClick={this.props.close}
        >
          <Icon className='fas fa-times' />
        </Button>
      </Drawer>
    );
  }
}
