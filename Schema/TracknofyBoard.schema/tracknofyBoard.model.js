const mongoose = require("mongoose")

const tracknofyBoardSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: [true, 'Task Name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        required: [true, 'Updated By is required']
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'UAT', 'Completed'],
        default: 'To Do'
    },
});

const TracknofyBoard = mongoose.model("TracknofyBoard",tracknofyBoardSchema)
module.exports = TracknofyBoard