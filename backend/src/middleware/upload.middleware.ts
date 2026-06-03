import multer from "multer";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const uploadResume = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
      return;
    }
    cb(new Error("INVALID_FILE_TYPE"));
  },
}).single("file");
