import { track, trigger } from "./effect";

let isObject = (val) => typeof val === 'object' && val !== null;

function createGetter(isReadonly) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    if(key === '_is_reactive') {
      return !isReadonly;
    }
    if(key === '_is_readonly') {
      return isReadonly;
    }
    // 依赖收集
    track(target, key); // target: {age: 10}, key: age

    if(isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  }
}

function createSetter(isReadonly) {
  return function setter(target, key, value) {
    const res = Reflect.set(target, key, value);
    if(isReadonly) {
      console.warn(`set ${JSON.stringify(target)} on key ${key} failed`);
      return true;
    }
    // 触发依赖
    trigger(target, key); // target: {age: 10}, key: age
    return res;
  }
}

export function reactive(raw) {
  return createReactiveObject(raw)
}

export function createReactiveObject(raw, isReadonly?) {
  return new Proxy(raw, {
    get: createGetter(isReadonly),
    set: createSetter(isReadonly)
  })
}

export function readonly(raw) {
  return createReactiveObject(raw, true);
}

export function isReactive(value) {
  // 通过增加一个标识来判断是否是响应式对象
  return !!value._is_reactive;
}

export function isReadonly(value) {
  // 通过增加一个标识来判断是否是响应式对象
  return !!value._is_readonly;
}