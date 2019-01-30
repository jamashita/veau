import * as React from 'react';
import { VictoryChart, VictoryLine } from 'victory';
import { Coordinate } from '../../../veau-entity/StatsItem';

type Props = {
  coordinates: Array<Array<Coordinate>>;
};
type State = {
};

const DURATION: number = 2000;

export class Chart extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const {
      coordinates
    } = this.props;

    if (coordinates.length !== nextProps.coordinates.length) {
      return true;
    }
    for (let i: number = 0; i < coordinates.length; i++) {
      if (coordinates[i].length !== nextProps.coordinates[i].length) {
        return true;
      }
      for (let j: number = 0; j < coordinates[i].length; j++) {
        if (coordinates[i][j].x !== nextProps.coordinates[i][j].x) {
          return true;
        }
        if (coordinates[i][j].y !== nextProps.coordinates[i][j].y) {
          return true;
        }
      }
     }

    return false;
  }

  public render(): React.ReactNode {
    const {
      coordinates
    } = this.props;
    return (
      <VictoryChart>
        {coordinates.map<React.ReactNode>((coordinate: Array<Coordinate>) => {
          return (
            <VictoryLine
              animate={{
                duration: DURATION
              }}
              data={coordinate}
              labels={(datum: Coordinate): number => {
                return datum.y;
              }}
            />
          );
        })}
      </VictoryChart>
    );
  }
}
