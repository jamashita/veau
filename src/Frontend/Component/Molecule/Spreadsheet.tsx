import React from 'react';

import { HotTable } from '@handsontable/react';
import { Nullable } from '@jamashita/publikum-type';

import { Stats } from '../../../Entity/Stats/Stats';
import { AsOfs } from '../../../VO/AsOf/AsOfs';
import { Column } from '../../../VO/Coordinate/Column';
import { Coordinate } from '../../../VO/Coordinate/Coordinate';
import { Row } from '../../../VO/Coordinate/Row';
import { HeaderSize } from '../../../VO/HeaderSize/HeaderSize';
import { NumericalValue } from '../../../VO/NumericalValue/NumericalValue';
import { StatsItemNames } from '../../../VO/StatsItem/StatsItemNames';

type CellValue = Nullable<string>;
type CellChange = [number, string | number, CellValue, CellValue];
type Props = Readonly<{
  stats: Stats;
  invalidValueInput(): void;
  dataDeleted(coordinate: Coordinate): void;
  dataFilled(coordinate: Coordinate, value: NumericalValue): void;
  rowSelected(row: Row): void;
  rowMoved(from: Column, to: Column): void;
}>;
type State = Readonly<{}>;

const SPREADSHEET_HEIGHT: number = 500;

export class Spreadsheet extends React.Component<Props, State> {
  public shouldComponentUpdate(nextProps: Props): boolean {
    // prettier-ignore
    const {
      stats
    } = this.props;

    if (stats.isSame(nextProps.stats)) {
      return false;
    }

    return true;
  }

  public render(): React.ReactNode {
    // prettier-ignore
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
      return null;
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
          for (let i: number = 0; i < changes.length; i++) {
            // eslint-disable-next-line prefer-destructuring
            const str: Nullable<string> = changes[i][3];

            if (str !== null) {
              if (Number.isNaN(Number(str))) {
                invalidValueInput();

                return false;
              }
            }
          }

          return true;
        }}
        afterChange={(changes: Nullable<Array<CellChange>>) => {
          if (changes === null) {
            return;
          }
          changes.forEach((change: CellChange) => {
            Row.of(change[0])
              .toQuantum()
              .ifPresent((row: Row) => {
                Column.of(Number(change[1]))
                  .toQuantum()
                  .ifPresent((column: Column) => {
                    const coordinate: Coordinate = Coordinate.of(row, column);
                    // eslint-disable-next-line prefer-destructuring
                    const str: Nullable<string> = change[3];

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
              });
          });
        }}
        afterSelection={(row1: number, col1: number, row2: number) => {
          if (row1 === row2) {
            Row.of(row1)
              .toQuantum()
              .ifPresent((row: Row) => {
                rowSelected(row);
              });
          }
        }}
        beforeRowMove={(columns: Array<number>, target: number) => {
          columns.forEach((column: number) => {
            if (column === target) {
              return;
            }

            Column.of(column)
              .toQuantum()
              .ifPresent((col1: Column) => {
                if (column < target) {
                  Column.of(target - 1)
                    .toQuantum()
                    .ifPresent((col2: Column) => {
                      rowMoved(col1, col2);
                    });

                  return;
                }

                Column.of(target)
                  .toQuantum()
                  .ifPresent((col2: Column) => {
                    rowMoved(col1, col2);
                  });
              });
          });

          return true;
        }}
        licenseKey='non-commercial-and-evaluation'
      />
    );
  }
}
