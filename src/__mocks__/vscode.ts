import type { TextEditorDecorationType, Uri, TextDocument, TextLine } from 'vscode';

export const window = {
    createTextEditorDecorationType(options: Object): TextEditorDecorationType {
      return {
        key: JSON.stringify(options),
        dispose() {},
      }
    },
};

export const workspace = {
  openTextDocument(fileUri: Uri): Thenable<TextDocument> {
    const { text } = fileUri as any as {text: string};

    const result = {
      getText() {
        return text;
      },
      positionAt(idx: number) {
        const line = Math.max(0, text.substring(0, idx).split('\n').length - 1);
        return {
          line
        };
      },
      lineAt(line: number): TextLine {
        return {
          text: text.split('\n')[line],
          lineNumber: line,
        } as TextLine;
      }
    } as any as TextDocument;

    return {
      then<T>(onfulfilled: ((doc: TextDocument) => T)) {
        return onfulfilled(result);
      }
    };
  },
};
