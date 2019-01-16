import * as React from 'react';
import {
  injectIntl,
  InjectedIntlProps
} from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import {Props} from '../../containers/page/LoadingIndicator';

type State = {
};

const size = 180;

class LoadingIndicatorImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Props, nextState: {}): boolean {
    const {
      loadingCount
    } = this.props;

    if (loadingCount === nextProps.loadingCount) {
      return false;
    }
    if (loadingCount === 0) {
      return true;
    }
    if (nextProps.loadingCount === 0) {
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
          <CircularProgress size={size} />
        </DialogContent>
      </Dialog>
    );
  }
}

export const LoadingIndicator = injectIntl(LoadingIndicatorImpl);
