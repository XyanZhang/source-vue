import { track, trackEffects, trigger, triggerEffects } from "./effect";
import { isObject } from "./utils";
import { reactive } from './reactive';

export function ref(value) {
  return new RefImpl(value);
}

// value 包裹成一个对象
// 将 ref 中的 value 与 effect 中的 fn 关联起来
class RefImpl {
  private _is_ref: boolean;
  private _value: any;
  private _rawValue: any;
  constructor(rawValue) {
    this._is_ref = true;
    this._value =  convert(rawValue);
    this._rawValue = rawValue;
  }

  get value() {
    track(this, "value");
    return this._value;
  }

  set value(newValue) {
    if (newValue !== this._value) {
      this._value =  convert(newValue);
      trigger(this, "value");
    }
  }
}

function convert(val) {
  return isObject(val) ? reactive(val) : val;
}

export function isRef(ref) {
  return !!ref._is_ref;
}
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}

export function triggerRefValue(ref) {
  triggerEffects(ref.dep);
}

export function trackRefValue(ref) {
  trackEffects(ref.dep)
}