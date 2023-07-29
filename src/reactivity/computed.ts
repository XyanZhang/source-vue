class ComputedRefImpl {
  private _value;
  private _dirty = true;
  public effect;
  public _getter;
  constructor(getter) {
    this._getter = getter;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}