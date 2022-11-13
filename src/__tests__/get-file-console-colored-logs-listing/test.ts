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
        '           console.log(`\\x1b[34m\\x1b[43m ${i} \\x1b[0m`);\n' +
        '}',
      );
      expect(listings).toEqual([
        "mockFile:2:12\n" +
        '    console.log(`\\x1b[34m\\x1b[43m ${i} \\x1b[0m`);\n'
      ]);
    });

    it('should display a multiline listing', async () => {
      const listings = await getListings(
        'for(let i = 0; i < 10; i++){\n' +
        '   if(array[i]){\n'+
        '      console.log(`\\x1b[34m\\x1b[43m\n' +
        '         - ${i}\n' +
        '         - value = ${array[i]}\n' +
        '      \\x1b[0m`);\n' +
        '   }\n'+
        '}',
      );
      expect(listings).toEqual([
        "mockFile:3:7\n" +
        '    console.log(`\\x1b[34m\\x1b[43m\n' +
        '         - ${i}\n' +
        '         - value = ${array[i]}\n' +
        '      \\x1b[0m`);\n'
      ]);
    });

    it('should return multiple listings on a single line', async () => {
      const listings = await getListings(
        '\n\n' +
        'console.log(`\\x1b[42m first \\x1b[0m`),console.log(`\\x1b[44m second \\x1b[0m`);\n'
      );
      expect(listings).toEqual([
        "mockFile:3:1\n" +
        '    console.log(`\\x1b[42m first \\x1b[0m`)\n',
        `mockFile:3:${1 + 'console.log(`\\x1b[42m first \\x1b[0m`),'.length}\n` +
        '    console.log(`\\x1b[44m second \\x1b[0m`);\n',
      ]);
    });

    it('should return multiple listings on multiple lines', async () => {
      const listings = await getListings(
        'console.log(`\\x1b[42m first \\x1b[0m`);\n'
        + 'console.log(`\\x1b[44m second \\x1b[0m`);\n'
        + '  console.log(`\\x1b[34m\\x1b[43m third \\x1b[0m`); console.log(`\\x1b[34m\\x1b[43m forth \\x1b[0m`);'
      );
      expect(listings).toEqual([
        "mockFile:1:1\n" +
        '    console.log(`\\x1b[42m first \\x1b[0m`);\n',
        'mockFile:2:1\n' +
        '    console.log(`\\x1b[44m second \\x1b[0m`);\n',
        "mockFile:3:3\n" +
        '    console.log(`\\x1b[34m\\x1b[43m third \\x1b[0m`);\n',
        `mockFile:3:${3 + 'console.log(`\\x1b[34m\\x1b[43m third \\x1b[0m`); '.length }\n` +
        '    console.log(`\\x1b[34m\\x1b[43m forth \\x1b[0m`);\n',
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