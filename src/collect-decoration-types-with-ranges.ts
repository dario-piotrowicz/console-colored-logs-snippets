import type { TextEditorDecorationType } from 'vscode';
import { backgroundColorCodes, foregroundColorCodes, resetCode, foregroundBackgroundColorCodes } from './colors';
import { getDecorationType } from './get-decoration-type';

export function collectDecorationTypesWithNumRanges(text: string, highlightsRange: 'full'| 'content') {
  let match;
  const decorationTypesWithNumRanges = new Map<TextEditorDecorationType, ([number, number])[]>();

  while (match = consoleColoredLogRegex.exec(text)) {
    const colorCode = match[1];

    const decorationType = getDecorationType(colorCode);
    if (decorationType) {
      if (!decorationTypesWithNumRanges.has(decorationType)) {
        decorationTypesWithNumRanges.set(decorationType, []);
      }

      const startIdx = match.index + (highlightsRange === 'full' ? 0 : "console.log(`".length + match[1].length);
      const endIdx = startIdx + match[highlightsRange === 'full' ? 0 : 2].length;

      decorationTypesWithNumRanges.get(decorationType)!.push([startIdx, endIdx]);
    }
  }
  return decorationTypesWithNumRanges;
}

const consoleColoredLogRegex = new RegExp(
  "console\\.log\\(\\s*`" +
    `(${[
      ...foregroundBackgroundColorCodes,
      ...foregroundColorCodes,
      ...backgroundColorCodes,
    ]
      .map((code) => code.replace(/\[/g, "\\["))
      .join("|")})` +
    "([\\s\\S]*?)" +
    `${resetCode.replace("[", "\\[")}\`\\s*\\);?`,
  "g"
);