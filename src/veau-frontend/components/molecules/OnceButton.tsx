import { Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import * as React from 'react';

type Props = ButtonProps;
type State = {
  disabled: boolean;
};

export class OnceButton extends React.Component<Props, State> {

  public constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      disabled: false
    };
  }

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      className,
      variant,
      color,
      size,
      fullWidth,
      children
    } = this.props;
    const {
      disabled
    } = this.state;

    return (
      <Button
        variant={variant}
        color={color}
        className={className}
        disabled={disabled}
        size={size}
        fullWidth={fullWidth}
        onClick={(): void => {
          if (!disabled) {
            this.setState({
              disabled: true
            });
          }
        }}
      >
        {children}
      </Button>
    );
  }
}
