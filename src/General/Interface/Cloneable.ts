export interface Cloneable<T extends Cloneable<T>> {

  duplicate(): T;
}
