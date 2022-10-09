
export const colorNames = {
  black: 'black',
  red: 'red',
  green: 'green',
  yellow: 'yellow',
  blue: 'blue',
  magenta: 'magenta',
  cyan: 'cyan',
  white: 'white',
} as const;

export type ColorName = keyof typeof colorNames;

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

export const backgroundColorCodeToColorNameMap: Record<string, ColorName> = {
  "\\\\x1b[40m": colorNames.black,
  "\\\\x1b[41m": colorNames.red,
  "\\\\x1b[42m": colorNames.green,
  "\\\\x1b[43m": colorNames.yellow,
  "\\\\x1b[44m": colorNames.blue,
  "\\\\x1b[45m": colorNames.magenta,
  "\\\\x1b[46m": colorNames.cyan,
  "\\\\x1b[47m": colorNames.white,
};

export const backgroundColorCodes = Object.keys(backgroundColorCodeToColorNameMap);

const codesToFbNameRegex = /(\\\\x1b\[\d\dm)(\\\\x1b\[\d\dm)/;

export function mapColorCodesToForegroundBackgroundColorNames(colorCodes: string): [ColorName, ColorName]|null {
  const match = codesToFbNameRegex.exec(colorCodes);
  if(!match) return null;

  const foregroundCode = match[1];
  const backgroundCode = match[2];
  const foregroundColorName = foregroundColorCodeToColorNameMap[foregroundCode];
  const backgroundColorName = backgroundColorCodeToColorNameMap[backgroundCode];
  if(!foregroundColorName || !backgroundColorName || foregroundColorName === backgroundColorName ) return null;

  return [foregroundColorName, backgroundColorName];
}

export const foregroundBackgroundColorCodes: string[] = [];
for (const foregroundColorCode of foregroundColorCodes) {
  const foregroundColorName = foregroundColorCodeToColorNameMap[foregroundColorCode];
  for (const backgroundColorCode of backgroundColorCodes) {
    const backgroundColorName = backgroundColorCodeToColorNameMap[backgroundColorCode];
    if(foregroundColorName !== backgroundColorName) {
      foregroundBackgroundColorCodes.push(`${foregroundColorCode}${backgroundColorCode}`);
    }
  }
}

export const resetCode = '\\\\x1b[0m';

export const colorNameToHexMap: Record<ColorName, string> = {
  [colorNames.black]: "#000000",
  [colorNames.red]: "#FF0000",
  [colorNames.green]: "#008000",
  [colorNames.yellow]: "#FFFF00",
  [colorNames.blue]: "#0000FF",
  [colorNames.magenta]: "#FF00FF",
  [colorNames.cyan]: "#00FFFF",
  [colorNames.white]: "#FFFFFF",
};