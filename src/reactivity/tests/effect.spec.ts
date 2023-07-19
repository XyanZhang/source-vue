import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  // it.skip: 跳过测试 
  it("should be true", () => {
    expect(true).toBe(true);
  });
  it("should be true", () => {
    const user = reactive({
      age: 10
    })
    let nextAge;
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11);
    
    // update
    user.age++;
    expect(nextAge).toBe(12);
  });
})