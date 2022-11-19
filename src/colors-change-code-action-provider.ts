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

    const [{colorCode}] = collectCclCommandsWithDetails(selectedText);
    const [fgColorName, bgColorName] = getForegroundBackgroundColorNamesFromFullColorCode(colorCode);

    const bgColorCode = bgColorName ? colorNameToBackgroundColorCodeMap[bgColorName].replace(/\\\\/g, '\\') : '';

    const createAction = getCreateActionFunction(colorCode, document, range);

    if(fgColorName) {
      const codeAction = createAction('Remove the text color', bgColorCode);
      codeActions.push(codeAction);
    }

    const possibleColors = colorNamesArray.filter(name => name !== fgColorName && name !== bgColorName);

    possibleColors.forEach(colorName => { 
      const newColorCode = `${
        colorNameToForegroundColorCodeMap[colorName].replace(/\\\\/g, '\\')
      }${
        bgColorCode
      }`;
      const codeAction = createAction(
        `${fgColorName ? 'Update' : 'Set'} text color to ${colorName}`, newColorCode);
      codeActions.push(codeAction);
    });

    const fgColorCode = fgColorName ? colorNameToForegroundColorCodeMap[fgColorName].replace(/\\\\/g, '\\') : '';

    if(bgColorName) {
      const codeAction = createAction('Remove the background color', fgColorCode);
      codeActions.push(codeAction);
    }

    possibleColors.forEach(colorName => {
      const newColorCode = `${
        fgColorCode
      }${
        colorNameToBackgroundColorCodeMap[colorName].replace(/\\\\/g, '\\')
      }`;
      const codeAction = createAction(
        `${bgColorName ? 'Update' : 'Set'} background color to ${colorName}`, newColorCode
      );
      codeActions.push(codeAction);
    });

    return codeActions;
  }

}

function getCreateActionFunction(currentColorCode: string, document: vscode.TextDocument, range: vscode.Range) {
    const selectedText = document.getText(range);

    function getUpdatedText(newColorCode: string): string {
      let newText = selectedText.replace(currentColorCode, newColorCode);
      if(!newColorCode) {
        newText = newText.replace(resetCode.replace(/\\\\/g, '\\'), '');
      }
      return newText;
    };

  return function createAction(title: string, newColorCode: string): vscode.CodeAction {
    const codeAction = new vscode.CodeAction(title, vscode.CodeActionKind.Empty);
    codeAction.edit = new vscode.WorkspaceEdit();
    codeAction.edit.replace(document.uri, range, getUpdatedText(newColorCode));
    return codeAction;
  }
}