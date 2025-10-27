const File = require('../models/fileModel');
const Folder = require("../models/folderModel");

// Create file 
async function createFile(folderName, name, details, userId) {
  if (!folderName || !name) return "folder name and file name are required";
  if (!userId) return "user not authenticated";

  const folderExists = await Folder.findOne({ name: folderName, userId });
  if (!folderExists) return "folder does not exist";

  const existing = await File.findOne({ folder: folderName, name, userId });
  if (existing) return "file already exists";

  const f = new File({ folder: folderName, name, details, userId });
  await f.save();

  return "file created";
}

// rename file
async function renameFile(folder, oldName, newName, userId) {
  if (!folder || !oldName || !newName) return "folder, oldName and newName required";
  if (!userId) return "user not authenticated";
  
  const updated = await File.findOneAndUpdate(
    { folder, name: oldName, userId }, 
    { name: newName }, 
    { new: true }
  );

  if (!updated) return "file not found";
  return "file renamed";
}

// delete file
async function deleteFile(folder, name, userId) {
  if (!folder || !name) return "folder and name required";
  if (!userId) return "user not authenticated";
  
  const res = await File.findOneAndDelete({ folder, name, userId });

  if (!res) return "file not found";
  return "file deleted";
}

// list files
async function listFiles(folder, userId) {
  if (!folder) return [];
  if (!userId) return [];
  return await File.find({ folder, userId }).lean();
}

// update file content 
async function updateFileContent(folder, name, newDetails, userId) {
  if (!folder || !name) return "folder and name required";
  if (!userId) return "user not authenticated";
  
  const updated = await File.findOneAndUpdate(
    { folder, name, userId },
    { details: newDetails },
    { new: true }
  );
  
  if (!updated) return "file not found";
  return "file updated";
};

module.exports = { createFile, renameFile, deleteFile, listFiles, updateFileContent };