import * as vscode from 'vscode';
import { getFileConsoleColoredLogsListing } from "../../get-file-console-colored-logs-listing";

describe('getFileConsoleColoredLogsListing', () => {
    it('should return a single listing for a log at the start of a basic file', async () => {
      const listings = await getListings(
        'console.log(`\\x1b[44m test \\x1b[0m`);'
      );
      expect(listings).toEqual([
        "mockFile:1:1\n" +
        "    console.log(`\\x1b[44m test \\x1b[0m`);\n"
      ]);
    });

    it('should return a single listing for an indented log', async () => {
      const listings = await getListings(
        'for(let i = 0; i < 10; i++){\n' +
        '           console.log(`\\x1b[34m\x1b[43m ${i} \\x1b[0m`);\n' +
        '}',
      );
      expect(listings).toEqual([
        "mockFile:2:12\n" +
        '    console.log(`\\x1b[34m\x1b[43m ${i} \\x1b[0m`);\n'
      ]);
    });
});

function getListings(fileContent: string) {
  const mockFileUri = {
    text: fileContent
  } as any as vscode.Uri;
  mockFileUri.toString = () => 'mockFile';

  return getFileConsoleColoredLogsListing(
    mockFileUri,
    (file: vscode.TextDocument, [start,end]: [number, number]) =>
      file.getText().substring(start, end),
  );
}