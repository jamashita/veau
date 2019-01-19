import {CircularProgress, Dialog, DialogContent, DialogTitle} from '@material-ui/core';
import * as React from 'react';
import {
  injectIntl,
  InjectedIntlProps
} from 'react-intl';
import {Props} from '../../containers/page/LoadingIndicator';

type State = {
};

const SIZE = 160;

class LoadingIndicatorImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    const {
      loadingCount
    } = this.props;

    if (loadingCount !== nextProps.loadingCount) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      loadingCount,
      intl
    } = this.props;

    return (
      <Dialog
        open={loadingCount > 0}
      >
        <DialogTitle
          style={{
            textAlign: 'center'
          }}
        >
          {intl.formatMessage({
            id: 'LOADING'
          })}
        </DialogTitle>
        <DialogContent >
          <CircularProgress size={SIZE} />
        </DialogContent>
      </Dialog>
    );
  }
}

export const LoadingIndicator = injectIntl(LoadingIndicatorImpl);
