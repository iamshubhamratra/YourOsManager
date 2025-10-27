const express = require("express");
const folderRoutes = express.Router();
const folderController = require("../controllers/folderController");
const { requireAuth } = require("../middleware/authMiddleware");

// Apply authentication to all folder routes
folderRoutes.use(requireAuth);

// create folder
folderRoutes.post("/create", async (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;
    const message = await folderController.createFolder(name, userId);
    res.json({ message, name });
});

// rename folder
folderRoutes.post("/rename", async (req, res) => {
    const { oldname, newname } = req.body;
    const userId = req.user._id;
    const message = await folderController.renameFolder(oldname, newname, userId);
    res.json({ message, oldName: oldname, newName: newname });
});

// delete folder
folderRoutes.post("/delete", async (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;
    const message = await folderController.deleteFolder(name, userId);
    res.json({ message, name });
});

// list folders
folderRoutes.get("/list", async (req, res) => {
  const userId = req.user._id;
  const folders = await folderController.list(userId);
  const folderNames = folders.map(f => f.name);
  res.json(folderNames);
});

module.exports = folderRoutes;