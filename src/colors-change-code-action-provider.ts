import * as vscode from 'vscode';
import { collectCclCommandsWithDetails } from './collect-ccl-commands-with-details';
import { colorNames, colorNameToBackgroundColorCodeMap, colorNameToForegroundColorCodeMap, getForegroundBackgroundColorNamesFromFullColorCode } from './colors';
import { consoleColoredLogRegex } from './console-colored-log-regex';

export class ColorsChangeCodeActionProvider implements vscode.CodeActionProvider {

  public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
    const selectedText = document.getText(range);

    if(!consoleColoredLogRegex.test(selectedText)) {
      return;
    }

    const codeActions: vscode.CodeAction[] = [];

    const [ { colorCode } ] = collectCclCommandsWithDetails(selectedText);
    const [fgColor, bgColor] = getForegroundBackgroundColorNamesFromFullColorCode(colorCode);

    if(fgColor !== colorNames.red) {
      const codeAction = new vscode.CodeAction(`Update text color to red`, vscode.CodeActionKind.Empty);
      codeAction.edit = new vscode.WorkspaceEdit();
      const newColorCode = `${colorNameToForegroundColorCodeMap['red'].replace(/\\\\/g, '\\')}${
        bgColor ? colorNameToBackgroundColorCodeMap[bgColor].replace(/\\\\/g, '\\') : ''
      }`;
      const newText = selectedText.replace(colorCode, newColorCode);
      codeAction.edit.replace(document.uri, range, newText);
      codeActions.push(codeAction);
    }
    return codeActions;
  }
}