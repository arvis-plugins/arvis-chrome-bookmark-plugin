const psl = require('psl');
const _ = require('lodash');
const {
  extractHostname,
  bookmarkDFS,
  getChromeBookmark
} = require('./utils');
const arvish = require('arvish');
const path = require('path');
const sep = path.sep;

const fetchBookmark = async (inputStr) => {
  const bookmarkRoot = await getChromeBookmark();

  const bookmarks = bookmarkDFS(bookmarkRoot).filter((item) => {
    const name = item.name.toLowerCase();
    const url = item.url.toLowerCase();
    const loweredInput = inputStr.normalize().toLowerCase();

    if (name.includes(loweredInput) || url.includes(loweredInput)) {
      return true;
    }
    return false;
  });

  return _.map(bookmarks, (item) => {
    const hostname = psl.get(extractHostname(item.url));
    const ret = {
      title: item.name,
      subtitle: item.url,
      arg: item.url,
      quicklookurl: item.url,
    };
    ret.icon = arvish.config.get('initialCaching', false) ? `${arvish.env.cache}${sep}cache${sep}${hostname}.png` : undefined;
    return ret;
  });
};

module.exports = {
  fetchBookmark
};