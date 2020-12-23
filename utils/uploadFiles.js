const multer = require("multer");

module.exports=function(req,res,folder,fn){
  let name=""
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, `public/${folder}`)
      },

      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' +file.originalname )
      }
    })
    
    var upload = multer({ storage: storage }).single('file')
    
    upload(req, res, function (err) {
      err="gerg"
      if (err instanceof multer.MulterError) {
        return fn({err,name})
      } else if (err) { 
        return fn({err,name})
      }
      err=""
      name=req.file.filename
      fn({err,name})
    })
}