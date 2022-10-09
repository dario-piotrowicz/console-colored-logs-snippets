# Console Colored Logs Snippets

![demo of ccl-red](demo-ccl-red.gif)

Very minimal set of snippets to add colors to `console.logs` (in javascript/typescript).

## How to use the snippets

After installing the extension the snippets will be immediately available in javascript and typescript files, just start typing `ccl-` to see all the available options (and `tab` to select one).

There are three type of snippets:

| snippet     | result                                                                 |
|-------------|------------------------------------------------------------------------|
|`ccl-X`      | a console log with its text colored `X`                                |
|`ccl-bg-Y`   | a console log with its background colored `Y`                          |
|`ccl-X-bg-Y` | a console log with its text colored `X` and its background colored `Y` |

Where `X` and `Y` indicate one of the following colors:
- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`

## Extra Notes

- This set of snippets was created to provide a very minimal quick and dirty way to add colors to nodejs' `console.log` calls since for them you need to remember the color codes (as they don't accept css stylings as the browser's calls do). Anyways browsers also accept the color codes so the snippets can also be used in standard browser js as well.

- Source for the color codes: [abritinthebay/consoleColors.js](https://gist.github.com/abritinthebay/d80eb99b2726c83feb0d97eab95206c4).

- The purpose for these snippets is for quickly styling the `console.log`s when debugging to allow you to
easily identify the outputs you're interested in. If you want to provide proper styling for your application I would suggest to use proper libraries instead, such as [chalk](https://github.com/chalk/chalk) or [cli-color](https://github.com/medikoo/cli-color) for nodejs apps.
