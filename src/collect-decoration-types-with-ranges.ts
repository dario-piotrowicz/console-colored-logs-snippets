import type { TextEditorDecorationType } from 'vscode';
import { collectCclCommandsWithDetails } from './collect-ccl-commands-with-details';
import { getDecorationType } from './get-decoration-type';

export function collectDecorationTypesWithNumRanges(text: string, highlightsRange: 'full'| 'content') {
  const cclCommandsWithDetails = collectCclCommandsWithDetails(text);
  const decorationTypesWithNumRanges = new Map<TextEditorDecorationType, ([number, number])[]>();

  cclCommandsWithDetails.forEach(cclCommandWithDetails => {
    const decorationType = getDecorationType(cclCommandWithDetails.colorCode);
    if (decorationType) {
      if (!decorationTypesWithNumRanges.has(decorationType)) {
        decorationTypesWithNumRanges.set(decorationType, []);
      }
      decorationTypesWithNumRanges.get(decorationType)!.push(cclCommandWithDetails[highlightsRange].numRange);
    }
  });

  return decorationTypesWithNumRanges;
}
