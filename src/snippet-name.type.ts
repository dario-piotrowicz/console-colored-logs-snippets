import type { ColorName } from "./colors";

export type SnippetName = `ccl-${ColorName}` | `ccl-bg-${ColorName}` |  `ccl-${ColorName}-bg-${ColorName}`;