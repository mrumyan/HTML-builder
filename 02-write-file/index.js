const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');

const stream = fs.createWriteStream(filePath);
const rl = readline.createInterface(process.stdin, process.stdout);

const endReading = () => {
    console.log("Goodbye!");
    stream.end();
    rl.close();
};

rl.setPrompt(`Please, enter the text (Enter exit or press ctrl + c to exit)\n`);
rl.prompt();

rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
        endReading();
    } else {
        stream.write(`${input}\n`);
    }
});

rl.on('SIGINT', () => endReading());