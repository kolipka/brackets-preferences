/* eslint-disable no-console, new-cap */
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function filter(filename) {
  const isOK = !filename.match(/node_modules/) &&
    !filename.match(/\.h/) &&
    !filename.match(/\.zip$/);
  return isOK;
}

function walk(root) {
    var files = [];
    fs.readdirSync(root).forEach(function(file) {
        var currPath = path.join(root, file);

        if (fs.statSync(currPath).isDirectory())
            files = files.concat(walk(currPath));

        if (filter(currPath) && !fs.statSync(currPath).isDirectory()) {
            files.push(path.normalize(currPath));
        }

    });
    return files;
}

function buildExtensionZip(input, version) {
  const ver = version !== '' ? '-' + version : '';
  const fName = `brackets.preferences${ver}.zip`;
  const output = fs.createWriteStream(fName);
  const archive = archiver('zip');
  const files = walk(input);

  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  console.log('Building', input, '->', fName);
  files.forEach(function(file) {
    archive.append(fs.createReadStream(file), { name: 'brackets-preferences/' + file })
  });
  archive.finalize();
}


if (process.argv.length < 3) {
  console.error('Usage: node build.js folder [version]');
  process.exit(1);
}

if (process.env.npm_package_version) {
  buildExtensionZip(process.argv[2], process.env.npm_package_version);
} else if (process.argv.length === 4) {
  buildExtensionZip(process.argv[2], process.argv[3]);
} else {
  buildExtensionZip(process.argv[2]);
}
