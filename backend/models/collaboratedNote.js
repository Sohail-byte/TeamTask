import mongoose from "mongoose"
const collaboratedNoteSchema = new mongoose.Schema({
    title: {
            type: String,
            required: true,
            default: 'New Note',
            unique: true
        },
        summary:{
            type: String,
            required: true
        },
        content: {
            type: String,
            default: ''
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        dateCreated:{
            type: Date,
            default: new Date
        },
        collaborators: [{
            user: {
            type: String,
            ref: 'User'
            }, 
            permissions: {
                type: String,
                default: 'view',
            },
            username:{
                type: String,
                unique: true,
                sparse: true     
            }
        }]
})


const collaborativeNote = mongoose.model('collaborativeNote', collaboratedNoteSchema)
export default collaborativeNote