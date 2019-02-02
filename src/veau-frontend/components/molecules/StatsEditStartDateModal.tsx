import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@material-ui/core';
import * as moment from 'moment';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { I18NLabel } from '../atoms/I18NLabel';
import { TextField } from '../atoms/TextField';

type Props = {
  open: boolean;
  close: () => void;
  determineStartDate: (startDate: string) => void;
};
type State = {
  startDate: string;
};

class StatsEditStartDateModalImpl extends React.Component<Props & InjectedIntlProps, State> {

  public constructor(props: Props & InjectedIntlProps) {
    super(props);
    this.state = {
      startDate: moment().format('YYYY-MM-DD')
    };
  }

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      open,
      intl,
      close,
      determineStartDate
    } = this.props;
    const {
      startDate
    } = this.state;

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
            <Icon className='fas fa-check' />
            <I18NLabel
              id='SUBMIT'
            />
          </Button>
          <Button
            color='secondary'
            onClick={close}
          >
            <Icon className='fas fa-times' />
            <I18NLabel
              id='CANCEL'
            />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const StatsEditStartDateModal: React.ComponentClass<Props, State> = injectIntl(StatsEditStartDateModalImpl);
