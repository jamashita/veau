import * as React from 'react';
import {injectIntl, InjectedIntlProps} from 'react-intl';
import {RawLabel} from './RawLabel';

type Props = {
  date: string;
  style?: object;
};

class DateLabelImpl extends React.Component<Props & InjectedIntlProps, {}> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    return true;
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

export const DateLabel = injectIntl(DateLabelImpl);
