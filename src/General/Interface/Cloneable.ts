export interface Cloneable<T extends Cloneable<T>> {

  copy(): T;
}
