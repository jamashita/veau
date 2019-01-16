import * as React from 'react';
import {default as Text} from '@material-ui/core/TextField';
import {ChangeEvent} from 'react';

type Props = {
  label: string;
  disabled?: boolean;
  type: string;
  value: string;
  defaultValue?: string
  onKeyUp?: (value: string) => void;
  onEnterUp?: () => void;
};
type State = {
};

export class TextField extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    return true;
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
