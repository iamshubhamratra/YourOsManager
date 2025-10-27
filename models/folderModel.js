const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index: user can't have duplicate folder names
FolderSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Folder', FolderSchema);