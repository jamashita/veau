import * as React from 'react';
import Typography from '@material-ui/core/Typography/Typography'

type Props = {
  style?: object;
};

export class RawLabel extends React.Component<Props, {}> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    return true;
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
