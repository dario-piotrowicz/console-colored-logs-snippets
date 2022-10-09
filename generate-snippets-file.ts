import * as fs from 'fs';

import { colorNameToForegroundColorCodeMap, colorNameToBackgroundColorCodeMap, resetCode } from './src/colors';

const snippetsFile = "./snippets/snippets.code-snippets"

fs.writeFileSync(snippetsFile, '');

function print(line: string) {
  fs.appendFileSync(snippetsFile, `${line}\n`);
}

print('{');

const rootPrefix = "ccl";

function printSnippet(snippetName: string, prefix: string, logCommand: string, description: string) {
  print(
    `
  "${snippetName}": {
    "prefix": "${rootPrefix}-${prefix}",
    "body": [
      "${logCommand}",
      "$2"
    ],
    "description": "${description}"
  },`);
}


for ( const [color, code] of Object.entries(colorNameToForegroundColorCodeMap) ) {
  printSnippet(
    `console.log with ${color} text`,
    color,
    `console.log(\`${code} $1 ${resetCode}\`);`,
    `console.log with its text colored in ${color}`
  );
}

for ( const [color, code] of Object.entries(colorNameToBackgroundColorCodeMap) ) {
  printSnippet(
    `console.log with a ${color} background`,
    `bg-${color}`,
    `console.log(\`${code} $1 ${resetCode}\`);`,
    `console.log with a ${color} background`
  );
}

for ( const [foregroundColor, foregroundCode] of Object.entries(colorNameToForegroundColorCodeMap) ) {
  for ( const [backgroundColor, backgroundCode] of Object.entries(colorNameToBackgroundColorCodeMap) ) {
    if(foregroundColor !== backgroundColor) {
      printSnippet(
        `console.log with ${foregroundColor} text and a ${backgroundColor} background`,
        `${foregroundColor}-bg-${backgroundColor}`,
        `console.log(\`${foregroundCode}${backgroundCode} $1 ${resetCode}\`);`,
        `console.log with ${foregroundColor} text and a ${backgroundColor} background`
      );
    }
  }
}

print('}');