import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _value;
  private _dirty = true; // 用于缓存，如果依赖的值没有变化，就不需要重新计算
  public effect;
  public _getter;
  constructor(getter) {
    this._getter = getter;

    // 利用scheduler，当依赖的值发生变化时，重新计算
    // 不会一直执行getter
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }
  get value() {
    if (this._dirty) {
      this._value = this.effect.run();
      this._dirty = false;
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}