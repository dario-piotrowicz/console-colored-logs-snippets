import type { TextEditorDecorationType } from 'vscode';
import { backgroundColorCodes, foregroundColorCodes, resetCode, foregroundBackgroundColorCodes } from './colors';
import { getDecorationType } from './get-decoration-type';

export function collectDecorationTypesWithNumRanges(text: string, highlightsRange: 'full'| 'content') {
  let match;
  const decorationTypesWithNumRanges = new Map<TextEditorDecorationType, ([number, number])[]>();

  const textWithoutComments = text
    .replace(/(\/\*([\s\S]*?)(\*\/|$))/g, convertStringToAsterisks)
    .replace(/(\/\/.*)/g, convertStringToAsterisks);

  while (match = consoleColoredLogRegex.exec(textWithoutComments)) {
    const wholeMatch = match[0];
    const spacingBeforeLogArgument = match[1];
    const colorCode = match[2];
    const contentOfLog = match[3];

    const decorationType = getDecorationType(colorCode);
    if (decorationType) {
      if (!decorationTypesWithNumRanges.has(decorationType)) {
        decorationTypesWithNumRanges.set(decorationType, []);
      }

      const startIdx = match.index + (
        highlightsRange === 'full'
        ? 0
        : `console.log(${spacingBeforeLogArgument}${colorCode}`.length);
      const endIdx = startIdx + (
        highlightsRange === 'full'
        ? wholeMatch
        : contentOfLog
      ).length;

      decorationTypesWithNumRanges.get(decorationType)!.push([startIdx, endIdx]);
    }
  }
  return decorationTypesWithNumRanges;
}

const consoleColoredLogRegex = new RegExp(
  "console\\.log\\((\\s*`)" +
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

function convertStringToAsterisks(str: string): string {
  return new Array(str.length).fill('*').join('');
}