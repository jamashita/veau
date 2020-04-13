export interface Equalable {

  equals(other: ThisType<unknown>): boolean;
}
