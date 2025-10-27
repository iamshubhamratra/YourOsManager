const Folder = require('../models/folderModel');
const File = require('../models/fileModel');

// create a new folder
async function createFolder(name, userId) {
  if (!name) return "name required";
  if (!userId) return "user not authenticated";
  
  const existing = await Folder.findOne({ name, userId });
  if (existing) return "folder already exists";
  
  const f = new Folder({ name, userId });
  await f.save();
  return "folder created";
}

// Rename folder
async function renameFolder(oldName, newName, userId) {
  if (!oldName || !newName) return "oldName and newName required";
  if (!userId) return "user not authenticated";
  
  const existing = await Folder.findOne({ name: oldName, userId });
  if (!existing) return "folder not found";
  
  // Check if new name already exists for this user
  const nameConflict = await Folder.findOne({ name: newName, userId });
  if (nameConflict) return "folder with new name already exists";
  
  existing.name = newName;
  await existing.save();
  
  await File.updateMany({ folder: oldName, userId }, { folder: newName });
  return "folder renamed";
}

// Delete folder
async function deleteFolder(name, userId) {
  if (!name) return "name required";
  if (!userId) return "user not authenticated";
  
  const res = await Folder.findOneAndDelete({ name, userId });
  if (!res) return "folder not found";
  
  await File.deleteMany({ folder: name, userId });
  return "folder deleted";
}

// list folders
async function list(userId) {
  if (!userId) return [];
  const folders = await Folder.find({ userId }).lean();
  return folders;
}

module.exports = { createFolder, renameFolder, deleteFolder, list };