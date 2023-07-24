import { effect, stop } from "../effect"
import { reactive } from "../reactive"

it('stop', () => {
  let dummy;
  const obj = reactive({
    prop: 1
  })
  const runner:any = effect(() => {
    dummy = obj.prop;
  })
  obj.prop = 2;
  expect(dummy).toBe(2);
  // 停止依赖收集
  stop(runner);

  obj.prop = 3;
  expect(dummy).toBe(2);
  // 重新开启依赖收集
  runner();
  expect(dummy).toBe(3);
})

// 执行stop时, 会执行onStop
it('onStop', () => {
  const obj = reactive({
    foo: 1
  })
  const onStop = jest.fn();
  let dummy;
  const runner = effect(() => {
    dummy = obj.foo;
  }, {
    onStop
  })
  stop(runner);
  expect(onStop).toBeCalledTimes(1);
})