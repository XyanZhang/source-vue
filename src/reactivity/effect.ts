let activeEffect:any = null;

let shouldTrack = false;
// 用于依赖收集，当前ReactiveEffect
export class ReactiveEffect {
  active = true; // 默认是激活的
  public deps = []; // 用于存储effect; 在stop时，将effect从deps中移除
  private _fn: any;
  constructor(public fn, public scheduler?, public onStop?: Function) {
    this._fn = fn;
  }
  run() {
    console.log("run");
    // 运行 run 的时候，可以控制 要不要执行后续收集依赖的一步
    // 目前来看的话，只要执行了 fn 那么就默认执行了收集依赖
    // 这里就需要控制了

    // 是不是收集依赖的变量

    // 执行 fn  但是不收集依赖
    if (!this.active) {
      return this.fn();
    }

    // 执行 fn  收集依赖
    // 可以开始收集依赖了
    shouldTrack = true;

    // 执行的时候给全局的 activeEffect 赋值
    // 利用全局属性来获取当前的 effect
    activeEffect = this as any;
    // 执行用户传入的 fn
    console.log("执行用户传入的 fn");
    const result = this.fn();
    // 重置
    shouldTrack = false;
    activeEffect = undefined;

    return result;
  }
  stop() {
    if(this.active) {
      // 如果第一次执行 stop 后 active 就 false 了
      // 这是为了防止重复的调用，执行 stop 逻辑
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  // 找到所有依赖这个 effect 的响应式对象
  // 从这些响应式对象里面把 effect 给删除掉
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });

  effect.deps.length = 0;
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

  trackEffects(dep)
}

export function trackEffects(dep) {

  // todo: 待优化，如果已经收集，就不需要再次收集
  // 有可能没有activeEffect
  if(!activeEffect) return ;
  // set 操作
  dep.add(activeEffect); // 将当前的ReactiveEffect存到容器中
  activeEffect.deps.push(dep); // 将dep存到ReactiveEffect中, 用于stop时，将effect从deps中移除
}

export function trigger(target, key) {
  let deps: any = [];
  // 触发依赖
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const dep = depsMap.get(key);
  deps.push(dep)

  const effects:any = [];
  deps.forEach((dep: any) => {
    effects.push(...dep)
  })
}

export function triggerEffects(dep) {
  // 执行收集到的所有的 effect 的 run 方法
  for (const effect of dep) {
    if (effect.scheduler) {
      // scheduler 可以让用户自己选择调用的时机
      // 这样就可以灵活的控制调用了
      // 在 runtime-core 中，就是使用了 scheduler 实现了在 next ticker 中调用的逻辑
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  const scheduler = options.scheduler;
  const onStop = options.onStop;
  // 调用effect时，会执行fn
  const _effect = new ReactiveEffect(fn, scheduler, onStop);
  // const { scheduler } = options;
  _effect.run();
  let runner:any = _effect.run.bind(_effect)
  runner.effect = _effect;

  return runner;
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}