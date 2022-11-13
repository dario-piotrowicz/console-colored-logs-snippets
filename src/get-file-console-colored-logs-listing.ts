import * as vscode from 'vscode';
import { collectCclCommandsWithDetails } from './collect-ccl-commands-with-details';

export async function getFileConsoleColoredLogsListing(
  fileUri: vscode.Uri,
  getFileRangeTextFunction: GetFileRangeTextFunction = getFileRangeText,
  ): Promise<string[]> {
  const listings: string[] = [];
  const file = await vscode.workspace.openTextDocument(fileUri);
  const text = file.getText();
  const cclCommandsWithDetails = collectCclCommandsWithDetails(text);
  for (const cclCommandWithDetails of cclCommandsWithDetails) {
    const range = cclCommandWithDetails.full.numRange;
    const positionStart = file.positionAt(range[0]);
    const cclText = getFileRangeTextFunction(file, range);
    const line = positionStart.line;
    const lineNumber = line + 1;
    const columnNumber = positionStart.character + 1;
    listings.push(
      `${fileUri}:${lineNumber}:${columnNumber}\n` +
      `    ${cclText}\n`
    );
  }
  return listings;
}

function getFileRangeText(file: vscode.TextDocument, [start,end]: [number, number]): string {
  const positionStart = file.positionAt(start);
  const positionEnd = file.positionAt(end);
  const cclText = file.getText(new vscode.Range(positionStart, positionEnd));
  return cclText;
}

type GetFileRangeTextFunction = typeof getFileRangeText;
