import { collectDecorationTypesWithNumRanges } from "../../collect-decoration-types-with-ranges";
import * as vscode from 'vscode';
import { getDecorationType } from "../../get-decoration-type";

describe('collectDecorationTypesWithNumRanges', () => {

  describe('basic scenarios', () => {
    it('should return an empty map for an empty return', () => {
        expect(collectDecorationTypesWithNumRanges('', 'full')).toEqual(new Map());
    });

    it('should match a log not ending with a semicolon', () => {
      const result = collectDecorationTypesWithNumRanges('console.log(`\\x1b[41m test \\x1b[0m`)', 'full');
      const expectedResult = new Map<vscode.TextEditorDecorationType, ([number, number])[]>([
        [getDecorationType('\\x1b[41m')!, [[0, 'console.log(`\\x1b[41m test \\x1b[0m`)'.length]]]
      ]);
      expect(result).toEqual(expectedResult);
    });

    it.only('should not match logs not following the snippets format', () => {
      const result = collectDecorationTypesWithNumRanges([
        'console.log(``);',
        'console.log(`this is a test`);',
        'console.log(`this is a \\x1b[41m test \\x1b[0m`)',
        'console.log(`this is a`, `\\x1b[41m test \\x1b[0m``);',
        'console.log(\'\\x1b[41m test \\x1b[0m\')',
        'console.log("\\x1b[41m test \\x1b[0m")',
        'console.log(`x1b[41m test x1b[0m`)',
      ].join('\n'), 'full');
      const expectedResult = new Map([]);
      expect(result).toEqual(expectedResult);
    });

    it('should full match a full string', () => {
      const result = collectDecorationTypesWithNumRanges('console.log(`\\x1b[31m test \\x1b[0m`);', 'full');
      const expectedResult = new Map<vscode.TextEditorDecorationType, ([number, number])[]>([
        [getDecorationType('\\x1b[31m')!, [[0, 'console.log(`\\x1b[31m test \\x1b[0m`);'.length]]]
      ]);
      expect(result).toEqual(expectedResult);
    });

    it('should content match a full string', () => {
      const result = collectDecorationTypesWithNumRanges('console.log(`\\x1b[31m test \\x1b[0m`);', 'content');
      const expectedResult = new Map<vscode.TextEditorDecorationType, ([number, number])[]>([
        [ getDecorationType('\\x1b[31m')!,
          [['console.log(`\\x1b[31m'.length, 'console.log(`\\x1b[31m'.length + ' test '.length]]
        ]
      ]);
      expect(result).toEqual(expectedResult);
    });
  });

});
