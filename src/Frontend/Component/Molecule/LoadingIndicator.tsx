import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { CircularProgress, Dialog, DialogContent, DialogTitle } from '@material-ui/core';

import { Props } from '../../Container/Molecule/LoadingIndicator';

type State = Readonly<{}>;

const SIZE: number = 100;

class LoadingIndicatorImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    // prettier-ignore
    const {
      loadingCount
    } = this.props;

    if (loadingCount !== nextProps.loadingCount) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    // prettier-ignore
    const {
      loadingCount,
      intl
    } = this.props;

    return (
      <Dialog open={loadingCount.isLoading()}>
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
          <CircularProgress size={SIZE} />
        </DialogContent>
      </Dialog>
    );
  }
}

export const LoadingIndicator: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(
  LoadingIndicatorImpl
);
