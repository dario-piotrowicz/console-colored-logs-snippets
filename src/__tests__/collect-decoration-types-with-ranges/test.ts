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

    it('should not match logs that are in a single line comment', () => {
      const result = collectDecorationTypesWithNumRanges('// console.log(`\\x1b[41m test \\x1b[0m`);', 'full');
      const expectedResult = new Map([]);
      expect(result).toEqual(expectedResult);
    });

    it('should not match logs that are in a single line multiline comment', () => {
      const result = collectDecorationTypesWithNumRanges('/* console.log(`\\x1b[41m test \\x1b[0m`); */', 'full');
      const expectedResult = new Map([]);
      expect(result).toEqual(expectedResult);
    });

    it('should not match logs that are in a multiline comment', () => {
      const resultDecorationsMap = collectDecorationTypesWithNumRanges(`
        console.log(\`\\x1b[46m cyan \\x1b[0m\`);

        /*
        console.log(\`\\x1b[41m red \\x1b[0m\`);

        console.log(\`\\x1b[43m yellow \\x1b[0m\`);
        */

        console.log(\`\\x1b[45m magenta \\x1b[0m\`);
      `, 'full');
      const resultDecorations = [];
      for(const decoration of resultDecorationsMap.keys()) {
        resultDecorations.push(decoration);
      }
      expect(resultDecorations).toEqual([
        getDecorationType('\\x1b[46m'),
        getDecorationType('\\x1b[45m')
      ]);
    });

    it('should not match logs that are in a non properly closed multiline comment', () => {
      // Note: in js/ts file if you start adding a /* vscode highlights all the
      //       rest of the file as a multiline comment until you add the closing */
      //       so we need to do the same for consistency sake
      const resultDecorationsMap = collectDecorationTypesWithNumRanges(`
        console.log(\`\\x1b[46m cyan \\x1b[0m\`);

        /*
        console.log(\`\\x1b[41m red \\x1b[0m\`);

        console.log(\`\\x1b[43m yellow \\x1b[0m\`);

        console.log(\`\\x1b[45m magenta \\x1b[0m\`);
      `, 'full');
      const resultDecorations = [];
      for(const decoration of resultDecorationsMap.keys()) {
        resultDecorations.push(decoration);
      }
      expect(resultDecorations).toEqual([
        getDecorationType('\\x1b[46m'),
      ]);
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

    it('should content match a log with extra spacing/newlines before and after the log argument', () => {
      // Note: we want this behavior because autoformatters can often move the log argument
      //       on a new line and indent it, so we want the matching to handle such changes
      const result = collectDecorationTypesWithNumRanges(`
        console.log(
          \`\\x1b[44m this is a test \\x1b[0m\`
        );`, 'content');
      const expectedResult = new Map<vscode.TextEditorDecorationType, ([number, number])[]>([
        [getDecorationType('\\x1b[44m')!, [[
          `
        console.log(
          \`\\x1b[44m`.length,
          `
        console.log(
          \`\\x1b[44m this is a test `.length]]]
      ]);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("when there are multiple logs to highlight", () => {
    it('should match all the logs in a single line', () => {
      const resultDecorationsMap = collectDecorationTypesWithNumRanges(
        'console.log(`\\x1b[31m red \\x1b[0m`), console.log(`\\x1b[32m green \\x1b[0m`), console.log(`\\x1b[34m blue \\x1b[0m`);',
        'content',
      );
      const resultDecorations = [];
      for(const decoration of resultDecorationsMap.keys()) {
        resultDecorations.push(decoration);
      }
      expect(resultDecorations).toEqual([
        getDecorationType('\\x1b[31m'),
        getDecorationType('\\x1b[32m'),
        getDecorationType('\\x1b[34m')
      ]);
    });

    it('should match all the logs in a multiline file', () => {
      const resultDecorationsMap = collectDecorationTypesWithNumRanges(`
      console.log(\`\\x1b[42m dffgdsg \\x1b[0m\`);

      console.log(
        \`\\x1b[36m\\x1b[43m $JSON({}) \\x1b[0m\`
      );

      console.log(\`\\x1b[41m this is a test \\x1b[0m\`);

      `, 'full');
      const resultDecorations = [];
      for(const decoration of resultDecorationsMap.keys()) {
        resultDecorations.push(decoration);
      }
      expect(resultDecorations).toEqual([
        getDecorationType('\\x1b[42m'),
        getDecorationType('\\x1b[36m\\x1b[43m'),
        getDecorationType('\\x1b[41m')
      ]);
    });
  });

  describe('when logs have extra arguments', () => {
    it('should content match a log with one extra argument', () => {
      const result = collectDecorationTypesWithNumRanges('console.log(`\\x1b[41m test \\x1b[0m`, { obj });', 'content');
      const expectedResult = new Map<vscode.TextEditorDecorationType, ([number, number])[]>([
        [ getDecorationType('\\x1b[41m')!,
          [['console.log(`\\x1b[41m'.length, 'console.log(`\\x1b[41m test '.length]]
        ]
      ]);
      expect(result).toEqual(expectedResult);
    });

    it('should full match a log with one extra argument', () => {
      const result = collectDecorationTypesWithNumRanges('console.log(`\\x1b[41m test \\x1b[0m`, { obj });', 'full');
      const expectedResult = new Map<vscode.TextEditorDecorationType, ([number, number])[]>([
        [ getDecorationType('\\x1b[41m')!,
          [[0, 'console.log(`\\x1b[41m test \\x1b[0m`, { obj });'.length]]
        ]
      ]);
      expect(result).toEqual(expectedResult);
    });

    it('should match a log with more than one extra argument (slipt over multiple lines)', () => {
      const input =
        `console.log(
          \`\\x1b[41m test \\x1b[0m\`,
          { obj },
          "this is a test",
        );`;
      const result = collectDecorationTypesWithNumRanges(input, 'full');
      const expectedResult = new Map<vscode.TextEditorDecorationType, ([number, number])[]>([
        [ getDecorationType('\\x1b[41m')!,
          [[0, input.length]]
        ]
      ]);
      expect(result).toEqual(expectedResult);
    });

    it('should match a log with a function call as an extra argument', () => {
      const result = collectDecorationTypesWithNumRanges(
        'console.log(`\\x1b[42m test with fn call \\x1b[0m`, testFn(`inside console.log`));', 'content'
      );
      const expectedResult = new Map<vscode.TextEditorDecorationType, ([number, number])[]>([
        [ getDecorationType('\\x1b[42m')!,
          [['console.log(`\\x1b[42m'.length, 'console.log(`\\x1b[42m test with fn call '.length]]
        ]
      ]);
      expect(result).toEqual(expectedResult);
    });

  });
});
