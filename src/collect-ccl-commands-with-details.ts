import { consoleColoredLogRegex } from "./console-colored-log-regex";

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

  const regex = new RegExp(consoleColoredLogRegex);
  while (match = regex.exec(textWithoutComments)) {
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


const jsMultilineCommentRegex = /(\/\*([\s\S]*?)(\*\/|$))/;
const jsSingleLineCommentRegex = /(\/\/.*)/;
const jsCommentsRegex = new RegExp(`${jsMultilineCommentRegex.source}|${jsSingleLineCommentRegex.source}`, 'g');

function convertStringToAsterisks(str: string): string {
  return new Array(str.length).fill('*').join('');
}
