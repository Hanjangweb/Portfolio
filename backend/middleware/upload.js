import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp/;
  const allowedPdfTypes = /pdf/;
  const extname = path.extname(file.originalname).toLowerCase();
  
  const isImage = allowedImageTypes.test(extname) && allowedImageTypes.test(file.mimetype);
  const isPdf = allowedPdfTypes.test(extname) && file.mimetype === 'application/pdf';

  if (isImage || isPdf) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, webp) or PDF files are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

export default upload;
