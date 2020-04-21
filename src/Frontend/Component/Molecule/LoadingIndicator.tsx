import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Props } from '../../Container/molecules/LoadingIndicator';

type State = Readonly<{}>;

const SIZE: number = 100;

class LoadingIndicatorImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
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
        open={loadingCount.isLoading()}
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
        <DialogContent>
          <CircularProgress
            size={SIZE}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export const LoadingIndicator: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(LoadingIndicatorImpl);
