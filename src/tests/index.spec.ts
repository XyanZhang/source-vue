import { add } from "../reactivity";

it('init', () => {
  let sum:any = add(1, 2);
  expect(sum).toBe(3);
});