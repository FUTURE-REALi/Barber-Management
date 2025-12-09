import multer from "multer";

const storage = multer.memoryStorage();

const uploadFileCloud = multer({storage}).array("files",10);

export default uploadFileCloud;