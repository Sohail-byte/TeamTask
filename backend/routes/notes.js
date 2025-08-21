import express from 'express'
import Note from '../models/note.js'
import isAuthenticated from '../utils/middleware/authentication.js'
const notesRouter = express.Router()










notesRouter.get('/create', isAuthenticated, ((req, res) => {
    res.render('notes/newNote')
}))

notesRouter.post('/create', async(req, res)=>{
    console.log(req.cookies)
    console.log(req.body)
    res.send('saveed')
})









export default notesRouter