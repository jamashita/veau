export type MonoFunction<I, O> = (arg: I) => O;
export type BiFunction<I1, I2, O> = (arg1: I1, arg2: I2) => O;
export type Consumer<T> = (arg: T) => void;
export type Predicate<T> = (arg: T) => boolean;
export type Supplier<T> = () => T;
export type Enumerator<K, V> = (value: V, key: K) => void;
export type Mapper<I, O> = (value: I, index: number) => O;
export type Resolve<T> = (arg: T) => unknown;
export type Reject = (arg: unknown) => unknown;
