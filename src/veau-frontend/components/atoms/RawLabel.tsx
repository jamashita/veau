import { ThemeStyle } from '@material-ui/core/styles/createTypography';
import Typography from '@material-ui/core/Typography/Typography';
import * as React from 'react';

type Props = {
  color?: 'inherit' | 'primary' | 'secondary' | 'default' | 'textPrimary' | 'textSecondary' | 'error';
  variant?: ThemeStyle;
  style?: {[key: string]: string};
};
type State = {
};

export class RawLabel extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const {
      style
    } = this.props;

    if (style !== nextProps.style) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      style,
      color,
      variant,
      children
    } = this.props;

    return (
      <Typography
        style={style}
        color={color}
        variant={variant}
      >
        {children}
      </Typography>
    );
  }
}
