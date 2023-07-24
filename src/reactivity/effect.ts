let activeEffect:any = null;
// 用于依赖收集，当前ReactiveEffect
class ReactiveEffect {
  public deps = []; // 用于存储effect; 在stop时，将effect从deps中移除
  private _fn: any;
  constructor(public fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    activeEffect = this; // 将当前的ReactiveEffect赋值给activeEffect
    // 不是，每个effect都有一个ReactiveEffect实例
    return this._fn();
  }
  stop() {
    this.deps.forEach((dep: any) => {
      dep.delete(this);
    });
  }
}

export function stop(runner) {
  runner.effect.stop();
}

// 将容器放到WeakMap中, 为什么要用WeakMap，因为WeakMap的key是弱引用，不会造成内存泄漏
const targetMap = new WeakMap();
export function track(target, key) {
  // 依赖收集
  console.log('target: ', target, 'key: ', key);
  // 构建一个容器
  // target => key => dep
  let depsMap = targetMap.get(target); // 取出target对应的容器
  if (!depsMap) {
    // 如果没有容器，就创建一个容器
    depsMap = new Map()
    targetMap.set(target, depsMap);
  }
  // 有容器，取出key对应的容器
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep); // 保存 key对应的容器
  }
  // set 操作
  dep.add(activeEffect); // 将当前的ReactiveEffect存到容器中
  activeEffect && activeEffect.deps.push(dep); // 将dep存到ReactiveEffect中, 用于stop时，将effect从deps中移除
}

export function trigger(target, key) {
  // 触发依赖
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach(effect => {
      if(effect.scheduler) {
        effect.scheduler();
      }else {
        effect.run();
      }
    })
  }
}

export function effect(fn, options: any = {}) {
  // 调用effect时，会执行fn
  const scheduler = options.scheduler;
  const _effect = new ReactiveEffect(fn, scheduler);
  // const { scheduler } = options;
  _effect.run();
  let runner:any = _effect.run.bind(_effect)
  runner.effect = _effect;

  return runner;
}
