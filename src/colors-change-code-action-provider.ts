import * as vscode from 'vscode';
import { collectCclCommandsWithDetails } from './collect-ccl-commands-with-details';
import { colorNamesArray, colorNameToBackgroundColorCodeMap, colorNameToForegroundColorCodeMap, getForegroundBackgroundColorNamesFromFullColorCode, resetCode } from './colors';
import { strictConsoleColoredLogRegex } from './console-colored-log-regex';

export class ColorsChangeCodeActionProvider implements vscode.CodeActionProvider {

  public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
    const selectedText = document.getText(range);

    if(!strictConsoleColoredLogRegex.test(selectedText)) {
      return;
    }

    const codeActions: vscode.CodeAction[] = [];

    const [ { colorCode } ] = collectCclCommandsWithDetails(selectedText);
    const [fgColorName, bgColorName] = getForegroundBackgroundColorNamesFromFullColorCode(colorCode);

    const bgColorCode = bgColorName ? colorNameToBackgroundColorCodeMap[bgColorName].replace(/\\\\/g, '\\') : '';

    if(fgColorName) {
      const codeAction = new vscode.CodeAction(`Remove the text color`, vscode.CodeActionKind.Empty);
      codeAction.edit = new vscode.WorkspaceEdit();
      const newColorCode = bgColorCode;
      let newText = selectedText.replace(colorCode, newColorCode);
      if(!newColorCode) {
        newText = newText.replace(resetCode.replace(/\\\\/g, '\\'), '');
      }
      codeAction.edit.replace(document.uri, range, newText);
      codeActions.push(codeAction);
    }

    const possibleColors = colorNamesArray.filter(name => name !== fgColorName && name !== bgColorName);

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

    if(bgColorName) {
      const codeAction = new vscode.CodeAction(`Remove the background color`, vscode.CodeActionKind.Empty);
      codeAction.edit = new vscode.WorkspaceEdit();
      const newColorCode = fgColorCode;
      let newText = selectedText.replace(colorCode, newColorCode);
      if(!newColorCode) {
        newText = newText.replace(resetCode.replace(/\\\\/g, '\\'), '');
      }
      codeAction.edit.replace(document.uri, range, newText);
      codeActions.push(codeAction);
    }

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
