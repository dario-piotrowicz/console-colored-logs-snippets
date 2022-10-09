import * as vscode from 'vscode';
import { backgroundColorCodes, backgroundColorCodeToColorNameMap, ColorName, colorNames, foregroundColorCodes, foregroundColorCodeToColorNameMap, mapColorCodesToForegroundBackgroundColorNames, resetCode, foregroundBackgroundColorCodes, colorNameToHexMap } from './colors';

export function activate(context: vscode.ExtensionContext) {
	console.log('"console-colored-logs" extension active');

	context.subscriptions.push(vscode.commands.registerCommand('console-colored-logs.enableHighlights', async () => {
    await vscode.workspace.getConfiguration('console-colored-logs').update('highlights.showHighlights', true, true);
    vscode.window.showInformationMessage('console-colored-logs highlights enabled');
    updateActiveTextEditorHighlights();
	}));

  context.subscriptions.push(vscode.commands.registerCommand('console-colored-logs.disableHighlights', async () => {
    await vscode.workspace.getConfiguration('console-colored-logs').update('highlights.showHighlights', false, true);
		vscode.window.showInformationMessage('console-colored-logs highlights disabled');
    clearDecorations();
    updateActiveTextEditorHighlights();
	}));

  vscode.workspace.onDidChangeTextDocument(updateActiveTextEditorHighlights);
}

function updateActiveTextEditorHighlights() {
  const showHighlights = !!vscode.workspace.getConfiguration('console-colored-logs').get('highlights.showHighlights');

  if (!showHighlights || !vscode.window.activeTextEditor?.document) return;

  const text = vscode.window.activeTextEditor.document.getText();

  clearDecorations();
  let match;
  const decorationTypesWithRanges = new Map<vscode.TextEditorDecorationType, vscode.Range[]>();

  while (match = consoleColoredLogRegex.exec(text)) {
    const colorCode = match[1];

    const decorationType = getDecorationType(colorCode);
    if(decorationType){
      if (!decorationTypesWithRanges.has(decorationType)) {
        decorationTypesWithRanges.set(decorationType, []);
      }
      const range = vscode.workspace.getConfiguration('console-colored-logs').get('highlights.range');

      const startIdx = match.index + (range === 'full' ? 0 : "console.log(`".length + match[1].length);
      const endIdx = startIdx + match[range === 'full' ? 0 : 2].length;

      const startPos = vscode.window.activeTextEditor.document.positionAt(startIdx);
      const endPos = vscode.window.activeTextEditor.document.positionAt(endIdx);
      decorationTypesWithRanges.get(decorationType)!.push(new vscode.Range(startPos, endPos));
    }
  }
  for (const [decorationType, ranges] of decorationTypesWithRanges.entries()) {
    vscode.window.activeTextEditor.setDecorations(decorationType, ranges);
  }
}

function clearDecorations() {
  for (const decorationType of decorationTypesMap.values() ) {
    vscode.window.activeTextEditor?.setDecorations(decorationType, []);
  }
}

const consoleColoredLogRegex = new RegExp(
  'console\\.log\\(\`'+
  `(${[
      ...foregroundBackgroundColorCodes,
      ...foregroundColorCodes,
      ...backgroundColorCodes,
    ].map(code => code.replace(/\[/g, '\\[')).join('|')
    })` +
    '([\\s\\S]*?)' +
    `${resetCode.replace('[', '\\[')}\`\\);`,
  'g'
);

type SnippetName = `ccl-${ColorName}` | `ccl-bg-${ColorName}` |  `ccl-${ColorName}-bg-${ColorName}`;

const decorationTypesMap = new Map<SnippetName, vscode.TextEditorDecorationType>();

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

function getDecorationType(colorCode: string): vscode.TextEditorDecorationType|null {
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

export function deactivate() {}
