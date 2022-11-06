import * as vscode from 'vscode';
import { collectDecorationTypesWithNumRanges } from './collect-decoration-types-with-ranges';

export async function getFileConsoleColoredLogsListing(fileUri: vscode.Uri): Promise<string[]> {
  const listings: string[] = [];
  const file = await vscode.workspace.openTextDocument(fileUri);
  const text = file.getText();
  // Todo: I'm using collectDecorationTypesWithNumRanges and ignoring the decorations
  //       a more proper function should be created for this instead
  const decorationTypesWithNumRanges = collectDecorationTypesWithNumRanges(text, 'full');
  const ranges: [number, number][] = [];
  for (const [, decorationTypeNumRanges] of decorationTypesWithNumRanges) {
    for (const range of decorationTypeNumRanges) {
      ranges.push(range);
      const positionStart = file.positionAt(range[0]);
      const positionEnd = file.positionAt(range[1]);
      const cclText = file.getText(new vscode.Range(positionStart, positionEnd));
      const line = positionStart.line;
      const textLine = file.lineAt(line);
      const lineNumber = line + 1;
      const columnNumber = textLine.text.indexOf(cclText) + 1;
      listings.push(
        `${fileUri}:${lineNumber}:${columnNumber}\n` +
        `    ${cclText}\n`
      );
    }
  }
  return listings;
}
