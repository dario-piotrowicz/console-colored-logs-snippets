import { collectDecorationTypesWithNumRanges } from "../../collect-decoration-types-with-ranges";
import * as vscode from 'vscode';
import { getDecorationType } from "../../get-decoration-type";

describe('collectDecorationTypesWithNumRanges', () => {

  describe('in basic scenarios', () => {
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

  describe("in cases in which the highlighting shouldn't be applied", () => {
    it('should not match logs not following the snippets format', () => {
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
  });

  describe('in multiline scenarios', () => {
    it('should match a log argument spanning over multiple lines', () => {
      const result = collectDecorationTypesWithNumRanges(`
        console.log(\`\\x1b[44m
          this test spans
          across multiple lines
        \\x1b[0m\`);`, 'full');
      const expectedResult = new Map<vscode.TextEditorDecorationType, ([number, number])[]>([
        [getDecorationType('\\x1b[44m')!, [[
          `
        `.length,
        `
        console.log(\`\\x1b[44m
          this test spans
          across multiple lines
        \\x1b[0m\`);`.length]]]
      ]);
      expect(result).toEqual(expectedResult);
    });

    it('should full match a log with extra spacing/newlines before and after the log argument', () => {
      // Note: we want this behavior because autoformatters can often move the log argument
      //       on a new line and indent it, so we want the matching to handle such changes
      const result = collectDecorationTypesWithNumRanges(`
        console.log(
          \`\\x1b[44m this is a test \\x1b[0m\`
        );`, 'full');
      const expectedResult = new Map<vscode.TextEditorDecorationType, ([number, number])[]>([
        [getDecorationType('\\x1b[44m')!, [[
          `
        `.length,
        `
        console.log(
          \`\\x1b[44m this is a test \\x1b[0m\`
        );`.length]]]
      ]);
      expect(result).toEqual(expectedResult);
    });
  });
});
