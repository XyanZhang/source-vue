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