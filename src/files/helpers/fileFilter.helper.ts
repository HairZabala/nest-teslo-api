export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  console.log(file);
  const allowedExtensions = ['jpg', 'jpeg', 'png'];
  const fileExtension = file.mimetype.split('/')[1];

  if (allowedExtensions.includes(fileExtension)) {
    callback(null, true);
  }

  return callback(null, false);
};
