class ReactiveEffect {
  private _fn: any;
  constructor(public fn) {
    this._fn = fn;
  }
  run() {
    this._fn()
  }
}

export function effect(fn) {
  // 调用effect时，会执行fn
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
