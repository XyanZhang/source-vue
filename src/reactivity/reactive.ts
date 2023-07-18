export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      console.log('get', key);
      return Reflect.get(target, key);
    }
  })
}