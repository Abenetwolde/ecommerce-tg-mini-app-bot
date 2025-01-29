import { Router } from 'express'
import auth from '../middleware/auth.js'
// import uploadImageController from '../controllers/uploadImage.controller.js'
import upload from '../middleware/multer.js'
// import uploadImageClodinary from '../utils/uploadImageClodinary.js'
import {uploadImageController,MultipleuploadImageController} from '../controllers/uploadImage.controller.js'
const uploadRouter = Router()

uploadRouter.post("/upload",auth,upload.single("image"),uploadImageController)
uploadRouter.post("/multi-upload", auth, upload.array("images", 10), MultipleuploadImageController);

export default uploadRouter