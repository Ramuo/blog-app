import path from 'path'
import multer from 'multer';
import sharp from 'sharp';


//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb) => {
  //check file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    //rejected files
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const photoUpload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits:{fileSize:1000000}
});

//Resize Profile Image 
const profilePhotoResize = async (req, res, next) => {
    //Check if there is no file 
    if(!req.file){
        return next();
    }else{
        req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

        await sharp(req.file.buffer)
            .resize(250, 250)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(path.join(`upload/images/profile/${req.file.filename}`));
        
        next();
    };
};

//Resize Post Image 
const postImagrResize = async (req, res, next) => {
    //Check if there is no file 
    if(!req.file){
        return next();
    }else{
        req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(path.join(`upload/images/posts/${req.file.filename}`));
        
        next();
    };
};

export {
  photoUpload, 
  profilePhotoResize, 
  postImagrResize,
};