import { collectDecorationTypesWithNumRanges } from "../../collect-decoration-types-with-ranges";
import * as vscode from 'vscode';
import { getDecorationType } from "../../get-decoration-type";

describe('collectDecorationTypesWithNumRanges', () => {

  describe('basic scenarios', () => {
    it('should return an empty map for an empty return', () => {
        expect(collectDecorationTypesWithNumRanges('', 'full')).toEqual(new Map());
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