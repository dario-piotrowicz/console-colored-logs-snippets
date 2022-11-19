import * as vscode from 'vscode';
import { collectCclCommandsWithDetails } from './collect-ccl-commands-with-details';
import { colorNamesArray, colorNameToBackgroundColorCodeMap, colorNameToForegroundColorCodeMap, getForegroundBackgroundColorNamesFromFullColorCode } from './colors';
import { consoleColoredLogRegex } from './console-colored-log-regex';

export class ColorsChangeCodeActionProvider implements vscode.CodeActionProvider {

  public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
    const selectedText = document.getText(range);

    if(!consoleColoredLogRegex.test(selectedText)) {
      return;
    }

    const codeActions: vscode.CodeAction[] = [];

    const [ { colorCode } ] = collectCclCommandsWithDetails(selectedText);
    const [fgColorName, bgColorName] = getForegroundBackgroundColorNamesFromFullColorCode(colorCode);

    const possibleColors = colorNamesArray.filter(name => name !== fgColorName && name !== bgColorName);

    const bgColorCode = bgColorName ? colorNameToBackgroundColorCodeMap[bgColorName].replace(/\\\\/g, '\\') : '';
    possibleColors.forEach(colorName => {
      const codeAction = new vscode.CodeAction(`Update text color to ${colorName}`, vscode.CodeActionKind.Empty);
      codeAction.edit = new vscode.WorkspaceEdit();
      const newColorCode = `${
        colorNameToForegroundColorCodeMap[colorName].replace(/\\\\/g, '\\')
      }${
        bgColorCode
      }`;
      const newText = selectedText.replace(colorCode, newColorCode);
      codeAction.edit.replace(document.uri, range, newText);
      codeActions.push(codeAction);
    });

    const fgColorCode = fgColorName ? colorNameToForegroundColorCodeMap[fgColorName].replace(/\\\\/g, '\\') : '';
    possibleColors.forEach(colorName => {
      const codeAction = new vscode.CodeAction(`Update background color to ${colorName}`, vscode.CodeActionKind.Empty);
      codeAction.edit = new vscode.WorkspaceEdit();
      const newColorCode = `${
        fgColorCode
      }${
        colorNameToBackgroundColorCodeMap[colorName].replace(/\\\\/g, '\\')
      }`;
      const newText = selectedText.replace(colorCode, newColorCode);
      codeAction.edit.replace(document.uri, range, newText);
      codeActions.push(codeAction);
    });

    return codeActions;
  }
}