const makeDir = require("make-dir");

module.exports = async function(foldername)  {
  await makeDir(`public/${foldername}`);
  return foldername
};
