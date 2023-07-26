import { track, trigger } from "./effect";

let isObject = (val) => typeof val === 'object' && val !== null;

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      if(key === '_is_reactive') return true;

      let res =  Reflect.get(target, key);
      if(isObject(res)) {
        return reactive(res);
      }
      // 依赖收集
      track(target, key); // target: {age: 10}, key: age

      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      // 触发依赖
      trigger(target, key); // target: {age: 10}, key: age

      return res;
    }
  })
}

export function readonly(raw) {
  console.log('raw', raw);
  return createReadonlyObject(raw);
}

function createReadonlyObject(raw) {
  let proxy = new Proxy(raw, {
    get(target, key, receiver) {
      console.log('receiver', receiver)
      if(key === '_is_readonly') return true;
      
      let res =  Reflect.get(target, key, receiver);
      if(isObject(res)) {
        return readonly(res);
      }
      return res;
    },
    set(target, key:any, value) {
      console.warn(`key: ${key} set failed`);
      return true;
    }
  })
  console.log(proxy)
  return proxy;
}

export function isReactive(value) {
  // 通过增加一个标识来判断是否是响应式对象
  return !!value._is_reactive;
}

export function isReadonly(value) {
  // 通过增加一个标识来判断是否是响应式对象
  return !!value._is_readonly;
}