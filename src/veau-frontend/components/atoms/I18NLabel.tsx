import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RawLabel } from './RawLabel';

type Props = {
  id: string;
  values?: {[key: string]: string};
  style?: {[key: string]: string};
};
type State =  {
};

class I18NLabelImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      id,
      values,
      style
    } = this.props;

    if (id !== nextProps.id) {
      return true;
    }
    if (values !== nextProps.values) {
      return true;
    }
    if (style !== nextProps.style) {
      return true;
    }

    return false;
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

export const I18NLabel: React.ComponentClass = injectIntl(I18NLabelImpl);
