import * as vscode from 'vscode';
import { collectDecorationTypesWithNumRanges } from './collect-decoration-types-with-ranges';

export async function listAllConsoleColoredLogs(vsCodeProgressObject: vscode.Progress<{increment: number}>) {
  vsCodeProgressObject.report({  increment: 0 });

  const files = await vscode.workspace.findFiles('**/*.{js,jsx,cjs,mjs,ts,tsx}', '**/node_modules/**');

  const results: string[] = [];

  if (!files || files.length === 0) {
    outputResults([]);
    return;
  }

  for (const fileUri of files) {
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
        results.push(
          `${fileUri}:${lineNumber}:${columnNumber}\n` +
          `    ${cclText}\n`
        );
      }
    }
  }

  outputResults(results);
  vsCodeProgressObject.report({ increment: 100 });
}


function outputResults(results: string[]) {
  const outputChannel = vscode.window.createOutputChannel('console colored logs listing');
  outputChannel.clear();
  if(results.length === 0) {
    outputChannel.appendLine('No console colored logs found');
  } else {
    for (const result of results) {
      outputChannel.appendLine(result);
    }
  }

  outputChannel.show();
}
