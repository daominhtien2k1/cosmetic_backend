const multer = require('multer');
const {setAndSendResponse, responseError} = require('../constants/response_code');

function fileFilter(req, file, cb){
    // console.log(file);
    if(file.mimetype.startsWith("image") || file.mimetype.startsWith("video")){
        return cb(null, true);
    }
    let error = new Error("Wrong type file");
    error.code = 'WRONG_TYPE_FILE';
    cb(error, false);
}

module.exports = (req, res, next) => {
    const upload = multer( {fileFilter: fileFilter} )
        .fields([
            {name: 'image', maxCount: 4},
            {name: 'video', maxCount: 1}
        ]);
    upload(req, res, (error) => {
        if(error) {
            // console.log(error);
            if(error.code === 'LIMIT_UNEXPECTED_FILE'){
                // vượt quá 4 ảnh
                return setAndSendResponse(res, responseError.MAXIMUM_NUMBER_OF_IMAGES);
            }
            if(error.code === 'WRONG_TYPE_FILE') {
                return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);
            }
            setAndSendResponse(res,responseError.UPLOAD_FILE_FAILED);
        } else {
            next();
        }
    })
}