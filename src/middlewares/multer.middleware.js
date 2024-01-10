import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/temp');
    },
    filename: (req, file, cb) => {
        cb(
            null,
            `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}}`
        );
    },
});

const upload = multer({
    storage,
});

export default upload;
