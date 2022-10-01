# console-colored-logs README

Very minimal set of snippets to add colors to console.logs.

This set of snippets was created to provide a very minimal quick and dirty way to add colors to nodejs' \`console.log\` calls
since for them you need to remember the color codes (as they don't accept css stylings as the browser's calls do).

Note: the idea for this set of snippets was for them to be used in node applications, but browsers also accept
      the color codes so the snippets can also be used in standard browser js as well.

Source for the color codes: https://gist.github.com/abritinthebay/d80eb99b2726c83feb0d97eab95206c4

Note: the purpose for this snippets is for quickly styling the \`console.log\`s when debugging to allow you to
      easily identify the outputs you're interested in. If you want to provide proper styling for your
      application I would suggest to use proper libraries instead, such as https://github.com/chalk/chalk or
      https://github.com/medikoo/cli-color for nodejs apps.
