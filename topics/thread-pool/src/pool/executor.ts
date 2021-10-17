export interface Executor<A extends unknown = unknown, R extends unknown = unknown> {
  exec: (...args: A[]) => Promise<R>;
  destroy: () => Promise<void>;
}
