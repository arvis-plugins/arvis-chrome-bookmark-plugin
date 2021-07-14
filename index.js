const { fetchBookmark } = require('./src/fetchBookmark');

const getPluginItem = async ({ inputStr }) => {
  let items = [];
  if (!inputStr) return { items };

  return {
    items: await fetchBookmark(inputStr),
  };
};

module.exports = getPluginItem;