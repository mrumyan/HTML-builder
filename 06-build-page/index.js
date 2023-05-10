const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');

const isCorrectExtension = (file, extension) => {
    return path.parse(file).ext.slice(1) === extension;
};

const createDir = async (dirPath) => {
    await fsp.rm(dirPath, { recursive: true, force: true });
    await fsp.mkdir(dirPath, { recursive: true });
};

const getHTMLComponents = async () => {
    const componentsDirPath = path.join(__dirname, 'components');

    const files = await fsp.readdir(componentsDirPath, { withFileTypes: true });
    const components = new Map();
    for (let file of files) {
        if (file.isFile() && isCorrectExtension(file.name, 'html')) {
            components.set(path.parse(file.name).name, path.join(componentsDirPath, file.name));
        }
    }
    return components;
};

const createHTML = async () => {
    const components = await getHTMLComponents();

    const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
    readStream.on('data', input => {
        for (let component of components) {
            fsp.readFile(components.get(component[0]), 'utf-8').then((componentContent) => {
                input = input.replace(new RegExp(`{{${component[0]}}}`), componentContent);

                const writeStream = fs.createWriteStream(path.join(projectPath, 'index.html'));
                writeStream.write(input);
            });
        }
    });
};

const createCSS = async () => {
    const stylesDirPath = path.join(__dirname, 'styles');
    const filePath = path.join(projectPath, 'style.css');
    const writeStream = fs.createWriteStream(filePath);

    const files = await fsp.readdir(stylesDirPath, { withFileTypes: true });
    for (let file of files) {
        if (file.isFile() && isCorrectExtension(file.name, 'css')) {
            const readStream = fs.createReadStream(path.join(stylesDirPath, file.name), 'utf-8');
            readStream.on('data', chunk => writeStream.write(`${chunk}\n`));
        }
    }

};

const copyDir = async (src, dest) => {
    const files = await fsp.readdir(src, { withFileTypes: true });
    await createDir(dest);
    for (let file of files) {
        if (file.isFile()) {
            await fsp.copyFile(path.join(src, file.name), path.join(dest, file.name));
        } else {
            await copyDir(path.join(src, file.name), path.join(dest, file.name));
        }
    }
}

const buildHTML = async () => {
    try {
        await createDir(projectPath);
        await createHTML();
        await createCSS();
        await copyDir(path.join(__dirname, 'assets'), path.join(projectPath, 'assets'));
    } catch (error) {
        console.log(error);
    }
};

buildHTML();