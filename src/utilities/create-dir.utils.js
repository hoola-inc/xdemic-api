const makeDir = require('make-dir');
const fs = require('fs');
const dirPath = require('path').join(__dirname, '../../public/csv-files');

if (!fs.existsSync(dirPath)) {
    (async () => {
        const path = await makeDir(dirPath);

        console.log('dir created', path);
    })();
} else {
    console.log('already exist');
}
