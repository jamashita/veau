import * as React from 'react';
import {injectIntl, InjectedIntlProps} from 'react-intl';
import {RawLabel} from './RawLabel';

type Props = {
  id: string;
  values?: {[key: string]: string};
  style?: object;
};

class I18NLabelImpl extends React.Component<Props & InjectedIntlProps, {}> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      id,
      values,
      style,
      intl
    } = this.props;

    return (
      <RawLabel
        style={style}
      >
        {intl.formatMessage(
          {
            id
          },
          values
        )}
      </RawLabel>
    );
  }
}

export const I18NLabel = injectIntl(I18NLabelImpl);
