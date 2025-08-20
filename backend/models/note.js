import mongoose, { mongo } from "mongoose";
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'New Note',
        unique: true
    },
    content: {
        type: String,
        default: ''
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Note = mongoose.model('Note', noteSchema)
export default Note