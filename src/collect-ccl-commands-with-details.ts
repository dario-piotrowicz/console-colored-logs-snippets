import { backgroundColorCodes, foregroundColorCodes, resetCode, foregroundBackgroundColorCodes } from './colors';

type MatchDetails = {
  text: string;
  numRange: [number, number];
};

type CclCommandWithDetails = {
  full: MatchDetails,
  content: MatchDetails,
  colorCode: string;
};

export function collectCclCommandsWithDetails(text: string): CclCommandWithDetails[] {
  let match;
  const cclCommandsWithDetails = [];

  const textWithoutComments = text.replace(jsCommentsRegex, convertStringToAsterisks);

  while (match = consoleColoredLogRegex.exec(textWithoutComments)) {
    const wholeMatch = match[0];
    const spacingBeforeLogArgument = match[1];
    const colorCode = match[2];
    const contentOfLog = match[3];

    const fullStartIdx = match.index;
    const contentStartIdx = match.index + `console.log(${spacingBeforeLogArgument}${colorCode}`.length;
    const fullEndIdx = fullStartIdx + wholeMatch.length;
    const contentEndIdx = contentStartIdx + contentOfLog.length;

    cclCommandsWithDetails.push({
      full: {
        text: wholeMatch,
        numRange: [fullStartIdx, fullEndIdx] as [number, number],
      },
      content: {
        text: contentOfLog,
        numRange: [contentStartIdx, contentEndIdx] as [number, number],
      },
      colorCode,
    })
  }
  return cclCommandsWithDetails;
}

const colorCodeRegex = new RegExp(
  `(${[
    ...foregroundBackgroundColorCodes,
    ...foregroundColorCodes,
    ...backgroundColorCodes,
  ]
    .map((code) => code.replace(/\[/g, "\\["))
    .join("|")})`
);
const resetCodeRegex = new RegExp(
  resetCode.replace("[", "\\[")
);
const consoleColoredLogRegex = new RegExp(
  `console\\.log\\((\\s*\`)${
    colorCodeRegex.source
  }([\\s\\S]*?)${
    resetCodeRegex.source
  }\`(,[\\s\\S]*?)?\\s*\\);?`,
  "g"
);

const jsMultilineCommentRegex = /(\/\*([\s\S]*?)(\*\/|$))/;
const jsSingleLineCommentRegex = /(\/\/.*)/;
const jsCommentsRegex = new RegExp(`${jsMultilineCommentRegex.source}|${jsSingleLineCommentRegex.source}`, 'g');

function convertStringToAsterisks(str: string): string {
  return new Array(str.length).fill('*').join('');
}
