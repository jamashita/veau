import { ThemeStyle } from '@material-ui/core/styles/createTypography';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RawLabel } from './RawLabel';

type Props = {
  id: string;
  values?: {[key: string]: string};
  color?: 'inherit' | 'primary' | 'secondary' | 'default' | 'textPrimary' | 'textSecondary' | 'error';
  variant?: ThemeStyle;
  style?: {[key: string]: string};
};
type State =  {
};

class I18NLabelImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      id,
      values,
      style,
      intl
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
    if (intl.locale !== nextProps.intl.locale) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      id,
      values,
      color,
      variant,
      style,
      intl
    } = this.props;

    return (
      <RawLabel
        color={color}
        variant={variant}
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

export const I18NLabel: React.ComponentClass<Props, State> = injectIntl(I18NLabelImpl);
