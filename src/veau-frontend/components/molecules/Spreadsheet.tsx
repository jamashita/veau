import { HotTable } from '@handsontable/react';
import React from 'react';
import { Stats } from '../../../veau-entity/Stats';
import { AsOfs } from '../../../veau-vo/AsOfs';
import { Column } from '../../../veau-vo/Column';
import { Coordinate } from '../../../veau-vo/Coordinate';
import { HeaderSize } from '../../../veau-vo/HeaderSize';
import { NumericalValue } from '../../../veau-vo/NumericalValue';
import { Row } from '../../../veau-vo/Row';
import { StatsItemNames } from '../../../veau-vo/StatsItemNames';

type CellValue = string | null;
type CellChange = [number, string | number, CellValue, CellValue];
type Props = {
  stats: Stats;
  invalidValueInput: () => void;
  dataDeleted: (coordinate: Coordinate) => void;
  dataFilled: (coordinate: Coordinate, value: NumericalValue) => void;
  rowSelected: (row: Row) => void;
  rowMoved: (from: Column, to: Column) => void;
};
type State = {
};

const SPREADSHEET_HEIGHT: number = 500;

export class Spreadsheet extends React.Component<Props, State> {

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
      stats,
      invalidValueInput,
      dataFilled,
      dataDeleted,
      rowSelected,
      rowMoved
    } = this.props;

    const data: Array<Array<string>> = stats.getData();
    const columnHeaders: AsOfs = stats.getColumns();
    const rowHeaders: StatsItemNames = stats.getRowHeaders();
    const size: HeaderSize = stats.getRowHeaderSize();

    if (rowHeaders.isEmpty()) {
      return (
        <div />
      );
    }

    return (
      <HotTable
        data={data}
        colHeaders={columnHeaders.toJSON()}
        rowHeaders={rowHeaders.toJSON()}
        rowHeaderWidth={size.get()}
        manualRowResize={true}
        manualColumnResize={true}
        manualRowMove={true}
        autoColumnSize={true}
        autoRowSize={true}
        className='htRight'
        selectionMode='range'
        height={SPREADSHEET_HEIGHT}
        enterMoves={{
          row: 0,
          col: 1
        }}
        beforeChange={(changes: Array<CellChange>) => {
          const length: number = changes.length;
          for (let i: number = 0; i < length; i++) {
            const str: string | null = changes[i][3];
            if (str !== null) {
              if (isNaN(Number(str))) {
                invalidValueInput();
                return false;
              }
            }
          }

          return true;
        }}
        afterChange={(changes: Array<CellChange> | null) => {
          if (changes === null) {
            return;
          }
          changes.forEach((change: CellChange) => {
            const row: Row = Row.of(change[0]);
            const column: Column = Column.of(Number(change[1]));
            const coordinate: Coordinate = Coordinate.of(row, column);
            const str: string | null = change[3];

            if (str === null) {
              dataDeleted(coordinate);
              return;
            }
            if (str.trim() === '') {
              dataDeleted(coordinate);
              return;
            }

            const value: NumericalValue = NumericalValue.of(Number(str));
            dataFilled(coordinate, value);
          });
        }}
        afterSelection={(row1: number, col1: number, row2: number) => {
          if (row1 === row2) {
            rowSelected(Row.of(row1));
          }
        }}
        beforeRowMove={(columns: Array<number>, target: number) => {
          columns.forEach((column: number) => {
            if (column === target) {
              return;
            }
            if (column < target) {
              rowMoved(Column.of(column), Column.of(target - 1));
              return;
            }

            rowMoved(Column.of(column), Column.of(target));
          });

          return true;
        }}
        licenseKey='non-commercial-and-evaluation'
      />
    );
  }
}
