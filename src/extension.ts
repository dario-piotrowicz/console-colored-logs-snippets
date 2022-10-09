import * as vscode from 'vscode';
import { foregroundColorCodes, resetCode } from './colors';

export function activate(context: vscode.ExtensionContext) {
	console.log('"console-colored-logs" extension active');

	context.subscriptions.push(vscode.commands.registerCommand('console-colored-logs.enableHighlights', () => {
    // TODO: this needs to update the settings
    vscode.window.showInformationMessage('console-colored-logs highlights enabled!');
	}));

  context.subscriptions.push(vscode.commands.registerCommand('console-colored-logs.disableHighlights', () => {
    // TODO: this needs to update the settings
		vscode.window.showInformationMessage('console-colored-logs highlights disabled!');
	}));

  // TODO: there need to be different styles for the different logs
  const DEFAULT_STYLE = {
    color: "#fff",
    backgroundColor: "#414141",
    border: '1px solid currentColor',
    borderRadius: '3px',
    padding: '2px',
    margin: '2px',
  };

  const decorationType = vscode.window.createTextEditorDecorationType(DEFAULT_STYLE);

  vscode.workspace.onDidChangeTextDocument(() => {
    const showHighlights = !!vscode.workspace.getConfiguration('console-colored-logs').get('showHighlights');

    if (!showHighlights || !vscode.window.activeTextEditor?.document) return;

    const text = vscode.window.activeTextEditor.document.getText();

    vscode.window.activeTextEditor.setDecorations(decorationType, []);
    let match;
    const pattern = new RegExp(
      `console\\.log\\(\`(?:${
        foregroundColorCodes.map(code => code.replace('[', '\\[')).join('|')})[\\s\\S]*?${resetCode.replace('[', '\\[')
      }\`\\);`
      , 'g');
    const ranges: vscode.Range[] = [];
    while (match = pattern.exec(text)) {
        const startPos = vscode.window.activeTextEditor.document.positionAt(match.index);
        const endPos = vscode.window.activeTextEditor.document.positionAt(match.index + match[0].length);
        ranges.push(new vscode.Range(startPos, endPos));
    }
    vscode.window.activeTextEditor.setDecorations(decorationType, ranges);
  });
}

export function deactivate() {}
