import * as React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Props = {
  data: Array<object>;
  items: Array<string>;
};
type State = {
};


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
        minHeight='500px'
      >
        <LineChart
          data={data}
        >
          <XAxis
            dataKey='name'
          />
          <YAxis/>
          <CartesianGrid/>
          <Legend/>
          <Tooltip/>
          {items.map<React.ReactNode>((item: string) => {
            return (
              <Line
                type='monotone'
                connectNulls={true}
                key={item}
                dataKey={item}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
