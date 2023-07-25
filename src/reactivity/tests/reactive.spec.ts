import { isReactive, reactive } from "../reactive";

describe('reactive', () => {
  it('should be true', () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    // get
    expect(observed.foo).toBe(1);
    
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
  })
});