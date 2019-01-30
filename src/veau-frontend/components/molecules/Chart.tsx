import * as React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Color } from '../../../veau-vo/Color';

type Props = {
  data: Array<object>;
  items: Array<string>;
};
type State = {
};

const CHART_HEIGHT: number = 500;
const MARGIN: number = 8;

export class Chart extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      data,
      items
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
          data={data}
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
          {items.reverse().map<React.ReactNode>((item: string) => {
            return (
              <Line
                type='monotone'
                connectNulls={true}
                key={item}
                dataKey={item}
                stroke={Color.random().toRGB()}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
