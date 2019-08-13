import { CircularProgress, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import * as React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Props } from '../../containers/molecules/LoadingIndicator';

type State = {
};

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
