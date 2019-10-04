import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@material-ui/core';
import moment from 'moment';
import React, { PropsWithChildren } from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { TextField } from '../atoms/TextField';

type Props = {
  open: boolean;
  close: () => void;
  determineStartDate: (startDate: string) => void;
};
type State = {
  startDate: string;
};

class StatsEditStartDateModalImpl extends React.Component<Props & WrappedComponentProps, State> {

  public constructor(props: Props & WrappedComponentProps) {
    super(props);
    this.state = {
      startDate: moment().format('YYYY-MM-DD')
    };
  }

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>, nextState: Readonly<State>): boolean {
    const {
      open
    }: PropsWithChildren<Props & WrappedComponentProps> = this.props;
    const {
      startDate
    }: State = this.state;

    if (open !== nextProps.open) {
      return true;
    }
    if (startDate !== nextState.startDate) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      open,
      intl,
      close,
      determineStartDate
    }: PropsWithChildren<Props & WrappedComponentProps> = this.props;
    const {
      startDate
    }: State = this.state;

    return (
      <Dialog
        open={open}
        onClose={close}
        fullWidth={true}
        maxWidth='md'
      >
        <DialogTitle>
          {intl.formatMessage({
            id: 'DETERMINE_START_DATE'
          })}
        </DialogTitle>
        <DialogContent>
          <TextField
            label={intl.formatMessage({
              id: 'START_DATE'
            })}
            type='date'
            value={startDate}
            onKeyUp={(date: string): void => {
              this.setState({
                startDate: date
              });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color='secondary'
            onClick={(): void => {
              determineStartDate(startDate);
            }}
          >
            <Icon
              className='fas fa-check'
            />
            {intl.formatMessage({
              id: 'SUBMIT'
            })}
          </Button>
          <Button
            color='secondary'
            onClick={close}
          >
            <Icon
              className='fas fa-times'
            />
            {intl.formatMessage({
              id: 'CANCEL'
            })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const StatsEditStartDateModal: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(StatsEditStartDateModalImpl);
