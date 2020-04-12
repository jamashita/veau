import { Failure } from './Failure';
import { Success } from './Success';
import { Try } from './Try';

export const manoeuvre: <S, F extends Error>(tries: Array<Try<S, F>>) => Try<Array<S>, F> = <S, F extends Error>(tries: Array<Try<S, F>>) => {
  const failure: Failure<S, F> | undefined = tries.find((t: Try<S, F>): t is Failure<S, F> => {
    return t.isFailure();
  });

  if (failure !== undefined) {
    return failure as unknown as Try<Array<S>, F>;
  }

  const values: Array<S> = tries.map<S>((t: Try<S, F>) => {
    return t.get();
  });

  return Success.of<Array<S>, F>(values);
};