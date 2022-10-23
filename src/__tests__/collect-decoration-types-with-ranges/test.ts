import { collectDecorationTypesWithNumRanges } from "../../collect-decoration-types-with-ranges";

test('simple test', () => {
  expect(collectDecorationTypesWithNumRanges('', 'full')).toEqual(new Map());
});