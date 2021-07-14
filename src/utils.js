const userName = require('os').userInfo().username;
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const fsPromise = require('fs').promises;
const os = require('os');
const sep = path.sep;

const conf = {
  browser: process.env.browser,
  chrome_profile: process.env.chrome_profile,
};

const {
  FAVICON_DB,
} = require('./constant');

const bookmarkDFS = (item, options = { targets: ['url'], depth: 99 }) => {
  if (options.depth <= -1) {
    return [];
  }

  if (item.type === 'url') {
    if (!options.targets || options.targets.includes('url')) {
      return [item];
    } else {
      return [];
    }
  } else {
    // 'folder' or 'root'
    const target = item.type === 'folder' ? item.children : item;
    const initialArr = options.targets.includes('folder') ? [item] : [];

    return _.reduce(target, (res, child) => {
      return [
        ...res,
        ..._.flatten(bookmarkDFS(child, { targets: options.targets, depth: options.depth - 1 })),
      ];
    }, initialArr);
  }
};

const getDBFilePath = (DBFile) => {
  if (process.platform === "darwin") {
    switch (conf["browser"]) {
      case "Chrome Canary":
        return `/Users/${userName}/Library/Application Support/Google/Chrome Canary/${conf["chrome_profile"]}/${DBFile}`;
      case "Edge":
        return `/Users/${userName}/Library/Application Support/Microsoft Edge/${conf["chrome_profile"]}/${DBFile}`;
      case "Chromium":
        // 'Chrome Cloud Enrollment' could be wrong (not sure)
        return `/Users/${userName}/Library/Application Support/Google/Chrome Cloud Enrollment/${conf["chrome_profile"]}/${DBFile}`;
      default:
        return `/Users/${userName}/Library/Application Support/Google/Chrome/${conf["chrome_profile"]}/${DBFile}`;
    }
  } else if (process.platform === "win32") {
    switch (conf["browser"]) {
      default:
        return `${os.homedir}${sep}AppData${sep}Local${sep}Google${sep}Chrome${sep}User Data${sep}${conf["chrome_profile"]}${sep}${DBFile}`;
    }
  } else if (process.platform === "linux") {
    switch (conf["browser"]) {
      default:
        return `${os.homedir}${sep}.config${sep}google-chrome${sep}${conf["chrome_profile"]}${sep}${DBFile}`;
    }
  }
  throw new Error(
    `Not supported platform! only support 'win32', 'darwin'. Current platform: ${process.platform}`
  );
};

async function getChromeBookmark() {
  const bookmarksPath = getDBFilePath('Bookmarks');
  const roots = JSON.parse(
    await fsPromise.readFile(bookmarksPath, {
      encoding: 'utf8',
    })
  ).roots;

  return roots;
}

function getFaviconDB () {
  const targetPath = getDBFilePath('Favicons');
  fs.copyFileSync(targetPath, FAVICON_DB);
  return sqlite(FAVICON_DB, sqliteOptions);
}

function replaceAll (string, search, replace) {
  return string.split(search).join(replace);
}

function extractHostname(url) {
  let hostname;
  // find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  // find & remove port number
  hostname = hostname.split(':')[0];
  // find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

module.exports = {
  getChromeBookmark,
  bookmarkDFS,
  extractHostname,
  getFaviconDB,
  replaceAll,
};