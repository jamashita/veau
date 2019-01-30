import * as React from 'react';
import { VictoryChart, VictoryLine } from 'victory';
import { Coordinate, CoordinateJSON } from '../../../veau-vo/Coordinate';

type Props = {
  data: Array<Array<Coordinate>>;
};
type State = {
};

const DURATION: number = 2000;

export class Chart extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const {
      data
    } = this.props;

    if (data.length !== nextProps.data.length) {
      return true;
    }
    for (let i: number = 0; i < data.length; i++) {
      if (data[i].length !== nextProps.data[i].length) {
        return true;
      }
      for (let j: number = 0; j < data[i].length; j++) {
        if (data[i][j].getX() !== nextProps.data[i][j].getX()) {
          return true;
        }
        if (data[i][j].getY() !== nextProps.data[i][j].getY()) {
          return true;
        }
      }
     }

    return false;
  }

  public render(): React.ReactNode {
    const {
      data
    } = this.props;

    return (
      <VictoryChart>
        {data.map<React.ReactNode>((coordinates: Array<Coordinate>, index: number) => {
          return (
            <VictoryLine
              key={index}
              animate={{
                duration: DURATION
              }}
              data={coordinates.map<CoordinateJSON>((datum: Coordinate) => {
                return datum.toJSON();
              })}
              labels={(datum: CoordinateJSON): number => {
                return datum.y;
              }}
            />
          );
        })}
      </VictoryChart>
    );
  }
}
