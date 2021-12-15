import { Kind, Peek, UnaryFunction } from '@jamashita/anden-type';
import Text from '@material-ui/core/TextField';
import React, { PropsWithChildren, useMemo } from 'react';

type Props = Readonly<{
  label: string;
  type: string;
  value: string;
  defaultValue?: string;
  disabled?: boolean;
  onKeyUp?(value: string): void;
  onEnterUp?(): void;
}>;

const doNothing: Peek = () => {
};

export const TextField: React.FC<Props> = (props: PropsWithChildren<Props>) => {
  const {
    label,
    disabled,
    type,
    value,
    defaultValue,
    onKeyUp,
    onEnterUp
  } = props;

  const keyUp: UnaryFunction<string, void> = useMemo<UnaryFunction<string, void>>(() => {
    if (Kind.isUndefined(onKeyUp)) {
      return doNothing;
    }

    return onKeyUp;
  }, []);
  const enterUp: Peek = useMemo<Peek>(() => {
    if (Kind.isUndefined(onEnterUp)) {
      return doNothing;
    }

    return onEnterUp;
  }, []);

  return (
    <Text
      disabled={disabled}
      label={label}
      fullWidth={true}
      type={type}
      value={value}
      defaultValue={defaultValue}
      onChange={(e1: React.ChangeEvent<HTMLInputElement>) => {
        keyUp(e1.target.value);

        e1.target.onkeydown = (e2: KeyboardEvent) => {
          if (e2.key === 'Enter') {
            enterUp();
          }
        };
      }}
    />
  );
};
