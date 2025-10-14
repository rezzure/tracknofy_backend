const Item = require('../../Schema/DMS.schema/DMS.model');
const fs = require('fs');
const path = require('path');

const deleteRecursively = async (folderId) => {
  const children = await Item.find({ parent: folderId });

  for (const child of children) {
    if (child.type === 'folder') {
      await deleteRecursively(child._id);
    } else {
      if (child.filePath && fs.existsSync(child.filePath)) {
        fs.unlinkSync(child.filePath);
      }
      await Item.findByIdAndDelete(child._id);
    }
  }

  await Item.findByIdAndDelete(folderId);
};

exports.getItems = async (req, res) => {
  try {
    const parentId = req.query.parent || null;
    const items = await Item.find({ parent: parentId }).sort({ type: -1, name: 1 }); // Folders first, then by name
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFolder = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const newFolder = new Item({
      name,
      type: 'folder',
      parent: parent || null,
    });
    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.uploadFiles = async (req, res) => {
  try {
    const { parent } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const fileEntries = files.map(file => ({
      name: file.originalname,
      type: 'file',
      parent: parent || null,
      filePath: file.path,
      size: file.size,
    }));

    const savedFiles = await Item.insertMany(fileEntries);
    res.status(201).json(savedFiles);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.renameItem = async (req, res) => {
  try {
    const { name } = req.body;
    const item = await Item.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.type === 'folder') {
      await deleteRecursively(item._id);
    } else { // file
      if (item.filePath && fs.existsSync(item.filePath)) {
        fs.unlinkSync(item.filePath);
      }
      await Item.findByIdAndDelete(item._id);
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.downloadFile = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item || item.type !== 'file') {
            return res.status(404).json({ message: 'File not found' });
        }
        res.download(item.filePath, item.name);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};