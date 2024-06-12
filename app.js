const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/tree/:dir(*)', (req, res) => {
  const directoryPath = path.resolve(req.params.dir);

  function printDirectory(dirPath, indentationLevel = 0) {
    const indentation = ''.padStart(indentationLevel * 2, ' ');
    let files = 0, directories = 0;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        res.write(`${indentation}${String.fromCodePoint(9500)} ${entry.name}/\n`);
        const [nestedFiles, nestedDirectories] = printDirectory(entryPath, indentationLevel + 1);
        files += nestedFiles;
        directories += nestedDirectories + 1;
      } else {
        res.write(`${indentation}${String.fromCodePoint(9492)} ${entry.name}\n`);
        files++;
      }
    }

    return [files, directories];
  }

  const [fileCount, directoryCount] = printDirectory(directoryPath);
  res.write(`\n${directoryCount} directories, ${fileCount} files\n`);
  res.end();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});