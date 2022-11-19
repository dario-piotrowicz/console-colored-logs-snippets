import { backgroundColorCodes, foregroundBackgroundColorCodes, foregroundColorCodes, resetCode } from "./colors";

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
export const consoleColoredLogRegex = new RegExp(
  `console\\.log\\((\\s*\`)${
    colorCodeRegex.source
  }([\\s\\S]*?)${
    resetCodeRegex.source
  }\`(,[\\s\\S]*?)?\\s*\\);?`,
  "g"
);