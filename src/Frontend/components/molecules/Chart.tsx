import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Stats } from '../../../Entity/Stats';
import { Colors } from '../../../VO/Colors';
import { StatsItemName } from '../../../VO/StatsItemName';

type Props = Readonly<{
  stats: Stats;
}>;
type State = Readonly<{}>;

const CHART_HEIGHT: number = 500;
const MARGIN: number = 8;

export class Chart extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const {
      stats
    } = this.props;

    if (stats.isSame(nextProps.stats)) {
      return false;
    }

    return true;
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
          <CartesianGrid />
          <Legend />
          <Tooltip />
          {stats.getItemNames().map<React.ReactNode>((item: StatsItemName, index: number) => {
            return (
              <Line
                type='monotone'
                connectNulls={true}
                key={item.get()}
                dataKey={item.get()}
                stroke={Colors.chartScheme().get(index).get().get()}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
