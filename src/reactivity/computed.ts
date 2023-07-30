import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _value;
  private _dirty = true; // 用于缓存，如果依赖的值没有变化，就不需要重新计算
  public effect;
  public _getter;
  constructor(getter) {
    this._getter = getter;

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
  set value(newValue) {
    // 对比新旧值，如果不一样，就更新
    if (newValue !== this._value) {
      this._setter(newValue);
    }

  }
  _setter(newValue) {
    this._value = newValue;
    this._dirty = false;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}