import multer from 'multer';
import path from 'path';
import {uploadFolder} from "../server";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const imageSize = Number(process.env.IMAGE_SIZE_LIMIT) || 5;
const upload = multer({
    storage: storage,
    limits: { fileSize: imageSize * 1024 * 1024 },
});

export default upload;