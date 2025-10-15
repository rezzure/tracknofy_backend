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

const checkUserPermission = (item, userEmail, operation) => {
  if (!item.assignTo || item.assignTo.length === 0) {
    return false;
  }
  
  const userAssignment = item.assignTo.find(assignment => 
    assignment.userEmail === userEmail
  );
  
  if (!userAssignment) {
    return false;
  }
  
  return userAssignment.allowedOperations.includes(operation);
};

const getItemsWithPermissions = async (parentId = null, userEmail = null) => {
  let query = { parent: parentId };
  
  if (userEmail) {
    query = {
      ...query,
      'assignTo.userEmail': userEmail
    };
  }
  
  const items = await Item.find(query).sort({ type: -1, name: 1 });
  return items;
};

exports.getItems = async (req, res) => {
  try {
    const parentId = req.query.parent || null;
    const userEmail = req.query.userEmail || null;
    
    const items = await getItemsWithPermissions(parentId, userEmail);
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.renameItem = async (req, res) => {
  try {
    const { name } = req.body;
    const { email, updaterName } = req.query;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (email && !checkUserPermission(item, email, 'write')) {
      return res.status(403).json({ message: 'You do not have permission to rename this item' });
    }
    
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id, 
      { 
        name: name.trim(), 
        updatedBy: email,  
        updaterName
      }, 
      { new: true }
    );
    
    res.json(updatedItem);
  } catch (err) {
    console.error("Error renaming item:", err);
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
    console.error("Error uploading files:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.createFolder = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const { email, createrName } = req.query;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Folder name is required' });
    }
    
    const newFolder = new Item({
      name: name.trim(),
      type: 'folder',
      parent: parent || null,
      createdBy: email,
      createrName
    });
    
    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (err) {
    console.error("Error creating folder:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.type === 'folder') {
      await deleteRecursively(item._id);
    } else {
      if (item.filePath && fs.existsSync(item.filePath)) {
        fs.unlinkSync(item.filePath);
      }
      await Item.findByIdAndDelete(item._id);
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.type !== 'file') {
      return res.status(404).json({ message: 'File not found' });
    }

    if (!fs.existsSync(item.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(item.filePath, item.name);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.assignUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail, permissions, description, userName } = req.body;
    const email = req.query.email;
    console.log(id, userEmail, userName, email )
    console.log('Assign user request 1:', { id, userEmail, userName, email });

    if (!userEmail || !userName) {
      return res.status(400).json({ message: 'User email and name are required' });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const allowedOperations = [];
    if (permissions && typeof permissions === 'object') {
      for (const [operation, isAllowed] of Object.entries(permissions)) {
        if (isAllowed === true) {
          allowedOperations.push(operation);
        }
      }
    }

    console.log('Allowed operations:', allowedOperations);

    const existingAssignmentIndex = item.assignTo.findIndex(
      assignment => assignment.userEmail === userEmail
    );

    const newAssignment = {
      userName:userName,
      userEmail:userEmail,
      allowedOperations,
      description: description || '',
      assignedBy: email,
      assignedAt: new Date()
    };

    console.log('New assignment:', newAssignment);

    if (existingAssignmentIndex > -1) {
      item.assignTo[existingAssignmentIndex] = newAssignment;
    } else {
      item.assignTo.push(newAssignment);
    }

    const updatedItem = await item.save();
    
    console.log('User assigned successfully');
    
    res.json({
      message: 'User assigned successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Error in assignUser:', error);
    res.status(500).json({ message: 'Failed to assign user: ' + error.message });
  }
};


exports.getUserItems = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const parentId = req.query.parent || null;
    
    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }
    
    const items = await getItemsWithPermissions(parentId, userEmail);
    res.json(items);
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ message: 'Failed to fetch user items' });
  }
};