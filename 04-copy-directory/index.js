const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const newDirPath = path.join(__dirname, 'files-copy');

const copyFile = (fileName) => {
    fs.copyFile(path.join(dirPath, fileName), path.join(newDirPath, fileName), (error) => {
        if (error) {
            console.log(error);
        }
    });
};

fs.mkdir(newDirPath, { recursive: true }, error => {
    if (!error) {
        fs.readdir(dirPath, { withFileTypes: true }, (error, files) => {
            if (!error) {
                for (let file of files) {
                    if (file.isFile()) {
                        copyFile(file.name);
                    }
                }
            } else {
                console.log(error);
            }
        });
    } else {
        console.log(error);
    }
});