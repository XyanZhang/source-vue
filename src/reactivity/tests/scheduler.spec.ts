import { effect } from "../effect";
import { reactive } from "../reactive";
// scheduler 的用处


it('scheduler', () => {
  // 1. effect 第二个参数 scheduler
  // 2. effect 第一次执行时, 会执行 fn
  // 3. 当响应式对象 set 时，不会执行fn, 会触发 scheduler
  // 4. 当执行runner的时候，会再次执行fn
  let dummy;
  let run: any;
  const scheduler = jest.fn(() => {
    run = runner;
  });
  const obj = reactive({
    foo: 1,
  });
  const runner = effect(
    () => {
      dummy = obj.foo;
    },
    { scheduler }
  );
  expect(scheduler).not.toHaveBeenCalled();
  expect(dummy).toBe(1);
  // should be called on first trigger
  obj.foo++;
  expect(scheduler).toHaveBeenCalledTimes(1);
  // should not run yet
  expect(dummy).toBe(1);
  // manually run
  run();
  // should have run
  expect(dummy).toBe(2);
});