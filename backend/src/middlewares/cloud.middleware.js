import multer from "multer";

const storage = multer.memoryStorage();

export const uploadMultipleFileCloud = multer({storage}).array("files",10);
export const uploadSingleFileCloud = multer({storage}).single("file");