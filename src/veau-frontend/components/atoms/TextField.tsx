import {default as Text} from '@material-ui/core/TextField';
import {ChangeEvent} from 'react';
import * as React from 'react';

type Props = {
  label: string;
  type: string;
  value: string;
  defaultValue?: string
  disabled?: boolean;
  onKeyUp?: (value: string) => void;
  onEnterUp?: () => void;
};
type State = {
};

export class TextField extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const {
      label,
      type,
      value,
      defaultValue,
      disabled,
      onKeyUp,
      onEnterUp
    } = this.props;

    if (label !== nextProps.label) {
      return true;
    }
    if (type !== nextProps.type) {
      return true;
    }
    if (value !== nextProps.value) {
      return true;
    }
    if (defaultValue !== nextProps.defaultValue) {
      return true;
    }
    if (disabled !== nextProps.disabled) {
      return true;
    }
    if (onKeyUp !== nextProps.onKeyUp) {
      return true;
    }
    if (onEnterUp !== nextProps.onEnterUp) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      label,
      disabled,
      type,
      value,
      defaultValue,
      onKeyUp,
      onEnterUp
    } = this.props;

    return (
      <Text
        disabled={disabled}
        label={label}
        fullWidth={true}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if (onKeyUp) {
            onKeyUp(event.target.value);
            event.target.onkeydown = (event: KeyboardEvent) => {
              if (event.key == 'Enter') {
                if (onEnterUp) {
                  onEnterUp();
                }
              }
            };
          }
        }}
      />
    );
  }
}
