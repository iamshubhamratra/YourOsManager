const express = require("express");
const fileRoutes = express.Router();
const fileController = require("../controllers/fileController");
const File = require("../models/fileModel");
const { requireAuth } = require("../middleware/authMiddleware");

// authentication to all file routes
fileRoutes.use(requireAuth);

// create
fileRoutes.post("/create", async (req, res) => {
    const data = req.body;
    const folder = data?.folder;
    const name = data?.name;
    const details = data?.details;
    const userId = req.user._id;
    const message = await fileController.createFile(folder, name, details, userId);
    res.json({ message, folder, name });
});

// rename 
fileRoutes.post("/rename", async (req, res) => {
    const { folder, oldname, newname } = req.body;
    const userId = req.user._id;
    const message = await fileController.renameFile(folder, oldname, newname, userId);
    res.json({ message, folder, oldName: oldname, newName: newname });
});

// delete
fileRoutes.post("/delete", async (req, res) => {
    const { folder, name } = req.body;
    const userId = req.user._id;
    const message = await fileController.deleteFile(folder, name, userId);
    res.json({ message, folder, name });
});

// list files 
fileRoutes.get("/list", async (req, res) => {
    const folder = req.query.folder;
    const userId = req.user._id;
    const files = await fileController.listFiles(folder, userId);
    const fileNames = files.map(f => f.name);
    res.json(fileNames); 
});

// content in file
fileRoutes.get("/content", async (req, res) => {
    const { folder, name } = req.query;
    const userId = req.user._id;
    try {
        const file = await File.findOne({ folder, name, userId });
        if (!file) {
            return res.status(404).json({ error: "file not found" });
        }
        res.json({ content: file.details || "" });
    } catch (error) {
        res.status(500).json({ error: "Error fetching file content" });
    }
});

// update file content 
fileRoutes.post("/update", async (req, res) => {
    const { folder, name, details } = req.body;
    const userId = req.user._id;
    const message = await fileController.updateFileContent(folder, name, details, userId);
    res.json({ message, folder, name });
});

module.exports = fileRoutes;