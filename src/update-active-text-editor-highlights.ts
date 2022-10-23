import * as vscode from 'vscode';
import { clearDecorations } from './clear-decorations';
import { collectDecorationTypesWithNumRanges } from './collect-decoration-types-with-ranges';

export function updateActiveTextEditorHighlights() {
  const showHighlights = !!vscode.workspace.getConfiguration('console-colored-logs').get('highlights.enabled');

  if (!showHighlights || !vscode.window.activeTextEditor?.document) return;

  clearDecorations();

  const text = vscode.window.activeTextEditor.document.getText();

  const highlightsRange = vscode.workspace.getConfiguration('console-colored-logs').get('highlights.range') as 'full'| 'content';
  
  const decorationTypesWithNumRanges = collectDecorationTypesWithNumRanges(text, highlightsRange);

  for (const [decorationType, numericalRanges] of decorationTypesWithNumRanges.entries()) {
    const vsCodeRanges = numericalRanges.map(([startIdx, endIdx]) => {
      const startPos = vscode.window.activeTextEditor!.document.positionAt(startIdx);
      const endPos = vscode.window.activeTextEditor!.document.positionAt(endIdx);
      return new vscode.Range(startPos, endPos);
    })
    vscode.window.activeTextEditor.setDecorations(decorationType, vsCodeRanges);
  }
}
