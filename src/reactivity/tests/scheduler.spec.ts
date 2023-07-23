import { effect } from "../effect";
import { reactive } from "../reactive";

it('scheduler', () => {
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