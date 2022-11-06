import * as vscode from 'vscode';
import { getFileConsoleColoredLogsListing } from './get-file-console-colored-logs-listing';

export async function listAllConsoleColoredLogs(vsCodeProgressObject: vscode.Progress<{increment: number}>) {
  vsCodeProgressObject.report({ increment: 0 });

  const files = await vscode.workspace.findFiles('**/*.{js,jsx,cjs,mjs,ts,tsx}', '**/node_modules/**');

  if (!files || files.length === 0) {
    outputResultOfListing(null);
    return;
  }

  const listings: string[] = [];

  for (const fileUri of files) {
    const fileListings = await getFileConsoleColoredLogsListing(fileUri);
    fileListings.forEach(listing => listings.push(listing));
  }

  outputResultOfListing(listings);
  vsCodeProgressObject.report({ increment: 100 });
}

function outputResultOfListing(results: string[]|null): void {
  if(!results) {
    outputAndShow(['No javascript nor typescript files found']);
    return;
  }

  if(results.length === 0) {
    outputAndShow(['No console colored logs found']);
    return;
  }

  outputAndShow(results);
}

function outputAndShow(lines: string[]) {
  const outputChannel = vscode.window.createOutputChannel('console colored logs listing');
  outputChannel.clear();
  lines.forEach(line => outputChannel.appendLine(line));
  outputChannel.show();
};