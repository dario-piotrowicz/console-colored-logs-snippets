import * as vscode from 'vscode';
import { getFileConsoleColoredLogsListing } from "../../get-file-console-colored-logs-listing";

describe('getFileConsoleColoredLogsListing', () => {
    it('should return a single listing for a basic file', async () => {
      const listings = await getListings(
        'console.log(`\\x1b[44m test \\x1b[0m`);'
      );
      expect(listings).toEqual([
        "mockFile:1:1\n" +
        "    console.log(`\\x1b[44m test \\x1b[0m`);\n"
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