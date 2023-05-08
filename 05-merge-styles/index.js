const fs = require('fs');
const path = require('path');

const stylesDirPath = path.join(__dirname, 'styles');
const filePath = path.join(__dirname, 'project-dist', 'bundle.css');

const writeStream = fs.createWriteStream(filePath);

fs.readdir(stylesDirPath, { withFileTypes: true }, (error, files) => {
    if (!error) {
        for (let file of files) {
            if (file.isFile() && path.parse(file.name).ext.slice(1) === 'css') {
                const readStream = fs.createReadStream(path.join(stylesDirPath, file.name), 'utf-8');
                readStream.on('data', chunk => writeStream.write(`${chunk}\n`));
            }
        }
    } else {
        console.log(error);
    }
});