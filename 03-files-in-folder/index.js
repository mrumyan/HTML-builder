const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

const getFileInfo = (fileName, stats) => {
    const parsedFile = path.parse(fileName);
    return `${parsedFile.name} - ${parsedFile.ext.slice(1)} - ${stats.size / 1024}kb`;
};

fs.readdir(dirPath, { withFileTypes: true }, (error, files) => {
    if (!error) {
        for (let file of files) {
            if (file.isFile()) {
                fs.stat(path.join(dirPath, file.name), (error, stats) => {
                    if (!error) {
                        console.log(getFileInfo(file.name, stats));
                    } else {
                        console.log(error);
                    }
                });

            }
        }
    } else {
        console.log(error);
    }
});