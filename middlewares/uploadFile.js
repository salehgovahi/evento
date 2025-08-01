const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const log = (message, data = null) => {
    console.log(`[Multer] ${new Date().toISOString()} - ${message}`);
    if (data) {
        console.log('Details:', data);
    }
};


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname).toLowerCase();
        const uuidFilename = uuidv4() + extname;
        cb(null, uuidFilename);
    }
});

const fileFilter = (req, file, cb) => {
    const videoTypes = /mp4/;
    const imageTypes = /jpg|jpeg|png/;
    const pdfTypes = /pdf/;
    const compressedFileTypes = /zip/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (videoTypes.test(extname) && videoTypes.test(mimetype)) {
        return cb(null, true);
    } else if (imageTypes.test(extname) && imageTypes.test(mimetype)) {
        return cb(null, true);
    } else if (pdfTypes.test(extname) && pdfTypes.test(mimetype)) {
        return cb(null, true);
    } else if (compressedFileTypes.test(extname) && compressedFileTypes.test(mimetype)) {
        return cb(null, true);
    } else {
        return cb(new Error('Only MP4 video, JPEG, PNG images, and PDF files are allowed'));
    }
};

const videoFilter = (req, file, cb) => {
    const videoTypes = /mp4/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (videoTypes.test(extname) && videoTypes.test(mimetype)) {
        return cb(null, true);
    } else {
        return cb(new Error('Only MP4 video files are allowed'));
    }
};

const imageFilter = (req, file, cb) => {
    const imageTypes = /jpg|png|jpeg/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (imageTypes.test(extname) && imageTypes.test(mimetype)) {
        return cb(null, true);
    } else {
        return cb(new Error('Only JPEG and PNG image files are allowed'));
    }
};

const documentFilter = (req, file, cb) => {
    const pdfTypes = /pdf/;
    const compressedFileTypes = /zip/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (pdfTypes.test(extname) && pdfTypes.test(mimetype)) {
        return cb(null, true);
    } else if (compressedFileTypes.test(extname) && compressedFileTypes.test(mimetype)) {
        return cb(null, true);
    } else {
        return cb(new Error('Only PDF and ZIP files are allowed'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const uploadVideo = multer({
    storage: storage,
    fileFilter: videoFilter
});

const uploadImage = multer({
    storage: storage,
    fileFilter: imageFilter
});

const uploadDocument = multer({
    storage: storage,
    fileFilter: documentFilter
});

module.exports = { upload, uploadVideo, uploadImage, uploadDocument };
