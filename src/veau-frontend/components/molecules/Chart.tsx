import * as React from 'react';
import { VictoryPie } from 'victory';

type Props = {
};
type State = {
};

export class Chart extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <VictoryPie/>
    );
  }
}
