import * as vscode from 'vscode';
import { clearDecorations } from './clear-decorations';
import { updateActiveTextEditorHighlights } from './update-active-text-editor-highlights';

export function activate(context: vscode.ExtensionContext) {
  console.log('"console-colored-logs" extension active');

  context.subscriptions.push(vscode.commands.registerCommand('console-colored-logs.enableHighlights', async () => {
    await vscode.workspace.getConfiguration('console-colored-logs').update('highlights.enabled', true, true);
    vscode.window.showInformationMessage('console-colored-logs highlights enabled');
    updateActiveTextEditorHighlights();
  }));

  context.subscriptions.push(vscode.commands.registerCommand('console-colored-logs.disableHighlights', async () => {
    await vscode.workspace.getConfiguration('console-colored-logs').update('highlights.enabled', false, true);
    vscode.window.showInformationMessage('console-colored-logs highlights disabled');
    clearDecorations();
    updateActiveTextEditorHighlights();
  }));

  vscode.window.onDidChangeActiveTextEditor(updateActiveTextEditorHighlights);
  vscode.workspace.onDidChangeTextDocument(updateActiveTextEditorHighlights);
}

export function deactivate() {}
