export type MonoFunction<I, O> = (value: I) => O;

export type BiFunction<I1, I2, O> = (value1: I1, value2: I2) => O;

export type Consumer<T> = MonoFunction<T, void>;

export type AsyncConsumer<T> = MonoFunction<T, Promise<void>>;

export type Predicate<T> = MonoFunction<T, boolean>;

export type Supplier<T> = MonoFunction<void, T>;

export type Enumerator<K, V> = BiFunction<V, K, void>;

export type Mapper<I, O> = BiFunction<I, number, O>;

export type Resolve<T> = Consumer<T>;

export type Reject = Consumer<unknown>;
