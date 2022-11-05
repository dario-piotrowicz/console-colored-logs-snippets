import * as vscode from 'vscode';

export async function listAllConsoleColoredLogs(vsCodeProgressObject: vscode.Progress<{increment: number}>) {
  vscode.window.showInformationMessage('looking for all the console colored logs');
  vsCodeProgressObject.report({  increment: 0 });
  await new Promise(resolve => setTimeout(resolve, 5000));
  vscode.window.showInformationMessage('found them!');
  vsCodeProgressObject.report({ increment: 100 });
}