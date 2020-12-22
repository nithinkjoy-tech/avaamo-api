const multer = require("multer");

module.exports=function(req,res,folder){
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
      if (err instanceof multer.MulterError) {
          return err
      } else if (err) { 
          return err
      }
    })
}