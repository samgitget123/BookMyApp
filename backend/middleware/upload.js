import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from "os";
// Correctly reference the 'uploads' folder at the root of the project
// Detect if running on Windows or Linux
const isWindows = os.platform() === "win32";

// Dynamic path selection
const uploadsDir = isWindows
  ? path.resolve("uploads") // Windows: Inside project folder
  : "/var/www/BookMyApp/backend/uploads"; // Linux: Server path
//const uploadsDir = path.resolve('uploads'); // This will resolve to 'C:/sampath/projects/bookingApp/uploads'
// Ensure 'uploads' directory exists
// Ensure 'uploads' directory exists (with recursive creation)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });  // ✅ Fix: Recursive directory creation
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);  // Use the absolute path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  console.log("Uploaded file mimetype:", file.mimetype); // Debug log

  const allowedTypes = [
    "image/jpeg", // Standard JPEG
    "image/jpg",  // Alternate JPEG
    "image/pjpeg", // Progressive JPEG
    "image/png",  // Standard PNG
    "image/x-png" // Alternate PNG
  ];
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
  // if (allowedTypes.includes(file.mimetype)) {
  //   cb(null, true);
  // } else {
  //   cb(new Error("Only image files (.jpg, .jpeg, .png) are allowed!"), false);
  // }
};

export const upload = multer({
  storage,
  fileFilter,
});
