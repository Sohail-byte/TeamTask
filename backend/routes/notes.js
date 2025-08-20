import express from 'express'
import Note from '../models/note.js'
const notesRouter = express.Router()










notesRouter.get('/create', ((req, res) => {
    res.render('notes/newNote')
}))











export default notesRouter