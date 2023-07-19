let activeEffect:any = null;
// 用于依赖收集，当前ReactiveEffect
class ReactiveEffect {
  private _fn: any;
  constructor(public fn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this; // 将当前的ReactiveEffect赋值给activeEffect
    // 不是，每个effect都有一个ReactiveEffect实例
    this._fn();
  }
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
      effect.run();
    })
  }
}

export function effect(fn) {
  // 调用effect时，会执行fn
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
