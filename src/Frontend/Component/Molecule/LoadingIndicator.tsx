import { CircularProgress, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { LoadingCount } from '../../../VO/LoadingCount/LoadingCount';

type Props = DispatchProps & OwnProps & StateProps;
type State = Readonly<{}>;

const SIZE: number = 100;

class LoadingIndicatorImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    const {
      loadingCount
    } = this.props;

    return !loadingCount.equals(nextProps.loadingCount);
  }

  public render(): React.ReactNode {
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

export type StateProps = Readonly<{
  loadingCount: LoadingCount;
}>;
export type DispatchProps = Readonly<{}>;
export type OwnProps = Readonly<{}>;

export const LoadingIndicator: React.ComponentType<WithIntlProps<Props>> = injectIntl(
  LoadingIndicatorImpl
);
