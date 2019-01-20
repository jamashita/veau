import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RawLabel } from './RawLabel';

type Props = {
  date: string;
  style?: {[key: string]: string};
};
type State = {
};

class DateLabelImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      date,
      style
    } = this.props;

    if (date !== nextProps.date) {
      return true;
    }
    if (style !== nextProps.style) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      date,
      style,
      intl
    } = this.props;

    return (
      <RawLabel
        style={style}
      >
        {intl.formatDate(
          date,
          {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
          }
        )}
      </RawLabel>
    );
  }
}

export const DateLabel: React.ComponentClass = injectIntl(DateLabelImpl);
