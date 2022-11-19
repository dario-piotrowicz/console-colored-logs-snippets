import * as vscode from 'vscode';
import { clearDecorations } from './clear-decorations';
import { ColorsChangeCodeActionProvider } from './colors-change-code-action-provider';
import { listAllConsoleColoredLogs } from './list-all-console-colored-logs';
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

  context.subscriptions.push(vscode.commands.registerCommand('console-colored-logs.listConsoleColoredLogs', function () {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        cancellable: false,
        title: 'Looking for console colored logs'
      },
      listAllConsoleColoredLogs,
    );
  }));

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider({pattern: '**/*.{js,cjs,mjs,jsx,ts,tsx}'}, new ColorsChangeCodeActionProvider())
  );

  vscode.window.onDidChangeActiveTextEditor(updateActiveTextEditorHighlights);
  vscode.workspace.onDidChangeTextDocument(updateActiveTextEditorHighlights);
}

export function deactivate() {}
