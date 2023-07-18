import { add } from "../reactivity";

it('init', () => {
  let sum = add(1, 2);
  expect(sum).toBe(3);
});