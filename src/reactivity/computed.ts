import { ReactiveEffect } from "./effect";
import { createDep } from "./dep";
import { trackRefValue, triggerRefValue } from "./ref";
class ComputedRefImpl {
  private _value;
  private _dirty = true; // 用于缓存，如果依赖的值没有变化，就不需要重新计算
  public effect;
  public dep;
  constructor(getter) {
    this.dep = createDep();
    // 利用scheduler，当依赖的值发生变化时，重新计算
    // 不会一直执行getter
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
  }
  get value() {
    // 收集依赖
    trackRefValue(this);

    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run();
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}