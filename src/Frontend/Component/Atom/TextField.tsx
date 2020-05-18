import { default as Text } from '@material-ui/core/TextField';
import React from 'react';

type Props = Readonly<{
  label: string;
  type: string;
  value: string;
  defaultValue?: string;
  disabled?: boolean;
  onKeyUp?: (value: string) => void;
  onEnterUp?: () => void;
}>;
type State = Readonly<{}>;

export class TextField extends React.Component<Props, State> {
  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    // prettier-ignore
    const {
      label,
      type,
      value,
      defaultValue,
      disabled
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

    return false;
  }

  public render(): React.ReactNode {
    // prettier-ignore
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
        onChange={(e1: React.ChangeEvent<HTMLInputElement>) => {
          if (onKeyUp !== undefined) {
            onKeyUp(e1.target.value);
            e1.target.onkeydown = (e2: KeyboardEvent) => {
              if (e2.key === 'Enter') {
                if (onEnterUp !== undefined) {
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
