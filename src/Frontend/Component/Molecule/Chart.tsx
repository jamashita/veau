import { Nullable } from '@jamashita/publikum-type';
import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Color } from '../../../VO/Color/Color';
import { Colors } from '../../../VO/Color/Colors';
import { StatsDisplay } from '../../../VO/Display/StatsDisplay';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';

type Props = Readonly<{
  stats: StatsDisplay;
}>;
type State = Readonly<{}>;

const CHART_HEIGHT: number = 500;
const MARGIN: number = 8;

export class Chart extends React.Component<Props, State> {
  public shouldComponentUpdate(nextProps: Props): boolean {
    // prettier-ignore
    const {
      stats
    } = this.props;

    if (stats.equals(nextProps.stats)) {
      return false;
    }

    return true;
  }

  public render(): React.ReactNode {
    // prettier-ignore
    const {
      stats
    } = this.props;

    return (
      <ResponsiveContainer width='100%' minHeight={CHART_HEIGHT}>
        <LineChart
          margin={{
            top: MARGIN,
            bottom: MARGIN,
            left: MARGIN,
            right: MARGIN
          }}
          data={stats.getChart()}
        >
          <XAxis dataKey='name'/>
          <YAxis domain={['dataMin', 'dataMax']}/>
          <CartesianGrid/>
          <Legend/>
          <Tooltip/>
          {stats.getItemNames().map<React.ReactNode>((item: StatsItemName, index: number) => {
            const color: Nullable<Color> = Colors.chartScheme().get(index);

            if (color === null) {
              return (
                <Line type='monotone' connectNulls={true} key={item.get()} dataKey={item.get()} stroke='#000000'/>
              );
            }

            return (
              <Line type='monotone' connectNulls={true} key={item.get()} dataKey={item.get()} stroke={color.get()}/>
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
