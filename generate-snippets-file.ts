import fs from 'fs';

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

const foregroundColors = {
  black: "\\\\x1b[30m",
  red: "\\\\x1b[31m",
  green: "\\\\x1b[32m",
  yellow: "\\\\x1b[33m",
  blue: "\\\\x1b[34m",
  magenta: "\\\\x1b[35m",
  cyan: "\\\\x1b[36m",
  white: "\\\\x1b[37m",
};


const backgroundColors = {
  black: "\\\\x1b[40m",
  red: "\\\\x1b[41m",
  green: "\\\\x1b[42m",
  yellow: "\\\\x1b[43m",
  blue: "\\\\x1b[44m",
  magenta: "\\\\x1b[45m",
  cyan: "\\\\x1b[46m",
  white: "\\\\x1b[47m",
};

const reset = '\\\\x1b[0m';

for ( const [color, code] of Object.entries(foregroundColors) ) {
  printSnippet(
    `console.log with ${color} text`,
    color,
    `console.log(\`${code} $1 ${reset}\`);`,
    `console.log with its text colored in ${color}`
  );
}

for ( const [color, code] of Object.entries(backgroundColors) ) {
  printSnippet(
    `console.log with a ${color} background`,
    `bg-${color}`,
    `console.log(\`${code} $1 ${reset}\`);`,
    `console.log with a ${color} background`
  );
}

for ( const [foregroundColor, foregroundCode] of Object.entries(foregroundColors) ) {
  for ( const [backgroundColor, backgroundCode] of Object.entries(backgroundColors) ) {
    if(foregroundColor !== backgroundColor) {
      printSnippet(
        `console.log with ${foregroundColor} text and a ${backgroundColor} background`,
        `${foregroundColor}-bg-${backgroundColor}`,
        `console.log(\`${foregroundCode}${backgroundCode} $1 ${reset}\`);`,
        `console.log with ${foregroundColor} text and a ${backgroundColor} background`
      );
    }
  }
}

print('}');