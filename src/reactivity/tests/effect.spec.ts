import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  // it.skip: 跳过测试 
  it("should be true", () => {
    expect(true).toBe(true);
  });
  it("should be true", () => {
    const user = reactive({
      age: 10
    })
    let nextAge;
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11);
    
    // update
    user.age++; // 触发依赖 执行effect
    // 注: 如何将 user.age 与 effect 中的 nextAge 关联起来 ? 
    // 通过 track 和 trigger 来实现
    // track 依赖收集: 将 effect 中的回调 存储到 targetMap 中
    // trigger 触发依赖: 将 targetMap 中的回调 依次执行

    // 多个 effect 时, 如何区分 ?
    // 通过 activeEffect 来区分
    // activeEffect: 当前正在执行的 effect
    // 通过 activeEffect 来将 effect 中的回调fn 存储到 targetMap 中
    // 通过 activeEffect 来将 targetMap 中的回调 依次执行

    // 每个effect 函数都会new 一个 ReactiveEffect 实例, 所以 每个 effect 都有自己的 activeEffect
    expect(nextAge).toBe(12);
  });
  it('', () => {
    // 1. effect -> function (runner) - fn -> return runner返回值
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  })
})