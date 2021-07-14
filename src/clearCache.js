const fs = require('fs');
const path = require('path');
const sep = path.sep;

fs.rmdirSync(`${arvish.env.cache}${sep}cache`, { recursive: true });
fs.mkdirSync(`${arvish.env.cache}${sep}cache`);