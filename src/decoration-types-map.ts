import * as vscode from 'vscode';
import { colorNames, colorNameToHexMap } from './colors';
import { SnippetName } from "./snippet-name.type";

export const decorationTypesMap = new Map<SnippetName, vscode.TextEditorDecorationType>();

for (const colorName of Object.values(colorNames)) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    color: colorName,
  });
  decorationTypesMap.set(`ccl-${colorName}`, decorationType);
  const bgDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: `${colorNameToHexMap[colorName]}30`,
  });
  decorationTypesMap.set(`ccl-bg-${colorName}`, bgDecorationType);
  for (const bgColorName of Object.values(colorNames)) {
    if(bgColorName !== colorName) {
      const decorationType = vscode.window.createTextEditorDecorationType({
        color: colorName,
        backgroundColor: `${colorNameToHexMap[bgColorName]}30`,
      });
      decorationTypesMap.set(`ccl-${colorName}-bg-${bgColorName}`, decorationType);
    }
  }
}
