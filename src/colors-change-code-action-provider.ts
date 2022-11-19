import * as vscode from 'vscode';

export class ColorsChangeCodeActionProvider implements vscode.CodeActionProvider {

  public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
    if (!this.isInsideConsoleColoredLog(document, range)) {
      return;
    }

    // todo: implement the various actions
    return [];
  }

  private isInsideConsoleColoredLog(document: vscode.TextDocument, range: vscode.Range) {
    // todo: to implement
    return false;
  }
}