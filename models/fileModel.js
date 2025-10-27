const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  folder: { 
    type: String, 
    required: true,
    index: true
  },
  name: { 
    type: String, 
    required: true 
  },
  details: { 
    type: String,
    default: '' 
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

// Compound index: user can't have duplicate file names in same folder
FileSchema.index({ userId: 1, folder: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('File', FileSchema);