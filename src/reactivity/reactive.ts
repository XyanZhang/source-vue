import { track, trigger } from "./effect";

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      if(key === '_is_reactive') return true;

      let res =  Reflect.get(target, key);
      
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
  return new Proxy(raw, {
    get(target, key) {
      
      if(key === '_is_readonly') return true;
      
      let res =  Reflect.get(target, key);

      return res;
    },
    set(target, key:any, value) {
      console.warn(`key: ${key} set failed`);
      return true;
    }
  })
}


export function isReactive(value) {
  // 通过增加一个标识来判断是否是响应式对象
  return !!value._is_reactive;
}

export function isReadonly(value) {
  // 通过增加一个标识来判断是否是响应式对象
  return !!value._is_readonly;
}