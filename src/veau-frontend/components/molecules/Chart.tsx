import * as React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Colors } from '../../../veau-collection/Colors';
import { Stats } from '../../../veau-entity/Stats';

type Props = {
  stats: Stats;
};
type State = {
};

const CHART_HEIGHT: number = 500;
const MARGIN: number = 8;

export class Chart extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const {
      stats
    } = this.props;

    if (stats.getItems().length() !== nextProps.stats.getItems().length()) {
      return true;
    }
    for (let i: number = 0; i < stats.getItems().length(); i++) {
      if (stats.getItems().get(i).getName() !== nextProps.stats.getItems().get(i).getName()) {
        return true;
      }
      if (stats.getItems().get(i).getValues().length() !== nextProps.stats.getItems().get(i).getValues().length()) {
        return true;
      }
      for (let j: number = 0; j < stats.getItems().get(i).getValues().length(); j++) {
        if (!stats.getItems().get(i).getValues().get(j).getAsOf().isSame(nextProps.stats.getItems().get(i).getValues().get(j).getAsOf())) {
          return true;
        }
        if (stats.getItems().get(i).getValues().get(j).getValue() !== nextProps.stats.getItems().get(i).getValues().get(j).getValue()) {
          return true;
        }
      }
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      stats
    } = this.props;

    return (
      <ResponsiveContainer
        width='100%'
        minHeight={CHART_HEIGHT}
      >
        <LineChart
          margin={{
            top: MARGIN,
            bottom: MARGIN,
            left: MARGIN,
            right: MARGIN
          }}
          data={stats.getChart()}
        >
          <XAxis
            dataKey='name'
          />
          <YAxis
            domain={[
              'dataMin',
              'dataMax'
            ]}
          />
          <CartesianGrid/>
          <Legend/>
          <Tooltip/>
          {stats.getItemNames().map<React.ReactNode>((item: string, index: number) => {
            return (
              <Line
                type='monotone'
                connectNulls={true}
                key={item}
                dataKey={item}
                stroke={Colors.chartScheme().get(index).get()}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
