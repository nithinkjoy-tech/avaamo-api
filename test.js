const makeDir=require("make-dir")

async function createPath(foldername="hello")  {
    const path=await makeDir(`E:/Codes/Node.js/New Projects/${foldername}`);
    return {foldername,path}
  };

createPath()