import multer from "multer";
import path from "path";
import fs from "fs";

const getUploadPath = (folder: string) => {
  const uploadPath = `src/assets/img/${folder}/`;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
};

const storage = (folder: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, getUploadPath(folder));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

// Middleware generator
export const uploadFile = (folder: string) =>
  multer({
    storage: storage(folder),
    limits: { fileSize: 5 * 1024 * 1024 },
  });

export const checkIfImageExists = async (imagePath: string) => {
  try {
    await fs.promises.access(imagePath);
    return true;
  } catch (error) {
    return false;
  }
};

export default uploadFile;
