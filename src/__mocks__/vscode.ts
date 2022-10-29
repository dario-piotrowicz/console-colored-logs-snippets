import type { TextEditorDecorationType } from 'vscode';

export const window = {
    createTextEditorDecorationType(options: Object): TextEditorDecorationType {
      return {
        key: JSON.stringify(options),
        dispose() {},
      }
    },
};
