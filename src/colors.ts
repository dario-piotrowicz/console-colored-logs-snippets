
const colorNames = {
  black: 'black',
  red: 'red',
  green: 'green',
  yellow: 'yellow',
  blue: 'blue',
  magenta: 'magenta',
  cyan: 'cyan',
  white: 'white',
} as const;

type ColorName = keyof typeof colorNames;

export const colorNameToForegroundColorCodeMap: Record<ColorName, string> = {
  [colorNames.black]: "\\\\x1b[30m",
  [colorNames.red]: "\\\\x1b[31m",
  [colorNames.green]: "\\\\x1b[32m",
  [colorNames.yellow]: "\\\\x1b[33m",
  [colorNames.blue]: "\\\\x1b[34m",
  [colorNames.magenta]: "\\\\x1b[35m",
  [colorNames.cyan]: "\\\\x1b[36m",
  [colorNames.white]: "\\\\x1b[37m",
};

export const foregroundColorCodeToColorNameMap: Record<string, ColorName> = {
  "\\\\x1b[30m": colorNames.black,
  "\\\\x1b[31m": colorNames.red,
  "\\\\x1b[32m": colorNames.green,
  "\\\\x1b[33m": colorNames.yellow,
  "\\\\x1b[34m": colorNames.blue,
  "\\\\x1b[35m": colorNames.magenta,
  "\\\\x1b[36m": colorNames.cyan,
  "\\\\x1b[37m": colorNames.white,
};

export const foregroundColorCodes = Object.keys(foregroundColorCodeToColorNameMap);

export const colorNameToBackgroundColorCodeMap: Record<ColorName, string> = {
  [colorNames.black]: "\\\\x1b[40m",
  [colorNames.red]: "\\\\x1b[41m",
  [colorNames.green]: "\\\\x1b[42m",
  [colorNames.yellow]: "\\\\x1b[43m",
  [colorNames.blue]: "\\\\x1b[44m",
  [colorNames.magenta]: "\\\\x1b[45m",
  [colorNames.cyan]: "\\\\x1b[46m",
  [colorNames.white]: "\\\\x1b[47m",
};

export const resetCode = '\\\\x1b[0m';
