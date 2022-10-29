import type { TextEditorDecorationType } from 'vscode';
import { backgroundColorCodeToColorNameMap, foregroundColorCodeToColorNameMap, mapColorCodesToForegroundBackgroundColorNames } from "./colors";
import { decorationTypesMap } from './decoration-types-map';
import type { SnippetName } from './snippet-name.type';

export function getDecorationType(colorCode: string): TextEditorDecorationType|null {
  colorCode = colorCode.replace(/\\x/g,'\\\\x');
  const foregroundBackgroundColorNames = mapColorCodesToForegroundBackgroundColorNames(colorCode);
  if(foregroundBackgroundColorNames) {
    const [foregroundColorName, backgroundColorName] = foregroundBackgroundColorNames;
    const snippetName: SnippetName = `ccl-${foregroundColorName}-bg-${backgroundColorName}`;
    if(decorationTypesMap.has(snippetName)) {
      return decorationTypesMap.get(snippetName)!;
    }
  }

  const foregroundColorName = foregroundColorCodeToColorNameMap[colorCode];
  if(foregroundColorName) {
    const snippetName: SnippetName = `ccl-${foregroundColorName}`;
    if(decorationTypesMap.has(snippetName)) {
      return decorationTypesMap.get(snippetName)!;
    }
  }

  const backgroundColorName = backgroundColorCodeToColorNameMap[colorCode];
  if(backgroundColorName) {
    const snippetName: SnippetName = `ccl-bg-${backgroundColorName}`;
    if(decorationTypesMap.has(snippetName)) {
      return decorationTypesMap.get(snippetName)!;
    }
  }

  return null;
}
