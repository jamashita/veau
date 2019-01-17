import * as React from 'react';
import Typography from '@material-ui/core/Typography/Typography'

type Props = {
  style?: {[key: string]: string};
};
type State = {
};

export class RawLabel extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Props): boolean {
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
      children
    } = this.props;

    return (
      <Typography
        style={style}
      >
        {children}
      </Typography>
    );
  }
}
