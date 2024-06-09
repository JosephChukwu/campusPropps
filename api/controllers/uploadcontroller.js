const asyncHandler = require('express-async-handler');
const multer = require('multer')
//const uploadController = require('express').Router()


//destination(where image will be saved) and filename(name of the saved image)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.filename)
    }
})

const upload = multer({ storage: storage})

//upload.single('image') is going to check in the req.body for the req.body.image
// uploadController.post('/image', upload.single('image'), async (req, res) => {
//     try {
//         return res.status(200).json('File uploaded successfully')
//     } catch (error) {
//         console.log(error)
//     }
// })

// module.exports = uploadController
const uploadImage = asyncHandler(async (req, res, next) => {
    try {
        return res.status(200).json('File uploaded successfully')
    } catch (error) {
        next(error)
        console.error(error);
        // return res.status(500).json('Error uploading files');
    }
})

module.exports = {upload, uploadImage}



