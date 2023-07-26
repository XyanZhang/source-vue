import { isReadonly, readonly } from "../reactive"

describe('readonly', () => {

  it('should make nested values readonly', () => {
    const original = { foo: { bar: 1 }, baz: [1, 2, 3] }
    const wrapped = readonly(original)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped.foo)).toBe(true)
    expect(isReadonly(wrapped.baz)).toBe(true)
    expect(isReadonly(wrapped.baz[0])).toBe(false) 
    expect(isReadonly(wrapped.foo.bar)).toBe(false) 
    const original1 = { name: 1 };
    const wrapped1 = readonly(original1);
    expect(isReadonly(wrapped1)).toBe(true);
    expect(isReadonly(wrapped1.name)).toBe(false);
  })
  it("warn then call set", () => {
    console.warn = jest.fn();
    const user = readonly({
      age: 10
    })
    user.age = 11;
    expect(console.warn).toBeCalled();
  })
})