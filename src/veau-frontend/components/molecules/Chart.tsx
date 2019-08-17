import * as React from 'react';
import { PropsWithChildren } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Stats } from '../../../veau-entity/Stats';
import { Colors } from '../../../veau-vo/collection/Colors';
import { StatsItemName } from '../../../veau-vo/StatsItemName';

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
    }: PropsWithChildren<Props> = this.props;

    if (stats.isSame(nextProps.stats)) {
      return false;
    }

    return true;
  }

  public render(): React.ReactNode {
    const {
      stats
    }: PropsWithChildren<Props> = this.props;

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
          {stats.getItemNames().map<React.ReactNode>((item: StatsItemName, index: number): React.ReactNode => {
            return (
              <Line
                type='monotone'
                connectNulls={true}
                key={item.get()}
                dataKey={item.get()}
                stroke={Colors.chartScheme().get(index).get()}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
