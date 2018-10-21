import * as React from 'react';
import {
  injectIntl,
  InjectedIntlProps
} from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import Icon from '@material-ui/core/Icon/Icon';
import {Props} from '../../containers/page/Modal';

class Modal extends React.Component<Props & InjectedIntlProps, {}> {

  public shouldComponentUpdate(nextProps: Props, nextState: {}): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      open,
      title,
      description,
      values,
      intl
    } = this.props;

    return (
      <Dialog
        open={open}
      >
        <DialogTitle>
          {intl.formatMessage(
            {
              id: title,
            },
            values
          )}
        </DialogTitle>
        <DialogContent>
          {intl.formatMessage(
            {
              id: description
            },
            values
          )}
        </DialogContent>
        <DialogActions>
          <Button
            key='close'
            color='primary'
            onClick={this.props.closeModalClicked}
          >
            <Icon className='fa fa-times fa-3x' />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default injectIntl(Modal);
