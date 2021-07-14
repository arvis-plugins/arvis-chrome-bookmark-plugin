const fs = require('fs');
const fsPromise = require('fs').promises;
const psl = require('psl');
const {
  existsAsync,
  extractHostname,
  getHistoryDB,
  getFaviconDB,
} = require('./utils');
const arvish = require('arvish');
const path = require('path');
const sep = path.sep;

(async function() {
  if (!fs.existsSync(`${arvish.env.cache}${sep}cache`)) {
    fs.mkdirSync(`${arvish.env.cache}${sep}cache`);
  }

  const bookmarkRoot = await getChromeBookmark();
  const bookmarks = bookmarkDFS(bookmarkRoot);

  // To do:: Add caching logic here

  arvish.config.set('initialCaching', true);

  console.log('Jobs done!');
}) ();
