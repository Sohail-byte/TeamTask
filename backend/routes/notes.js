import express from 'express'
import Note from '../models/note.js'
import isAuthenticated from '../utils/middleware/authentication.js'
import decodeJWTToken from '../utils/decodeToken.js'
const notesRouter = express.Router()










notesRouter.get('/create', isAuthenticated, ((req, res) => {
    res.render('notes/newNote')
}))
//creating new notes and storing the notes
notesRouter.post('/create', async(req, res)=>{

    const {title, summary, content} = req.body
    const decodedToken = decodeJWTToken(req.cookies.token)
    const userId = decodedToken?.payload?.userId
    // console.log({title, content})
    try{
        const newNote = await new Note({
            title,
            content,
            summary,
            userId
        }).save()
        res.status(201).redirect('/dashboard')
    }catch(e){
        console.log(e)
        res.status(500).json({msg: "failed to save note"})
    }

})

//route for retrieving all the notes
notesRouter.get('/', isAuthenticated, async (req, res) => {
    const decodedToken = decodeJWTToken(req.cookies.token)
    const userId = decodedToken?.payload?.userId
    const notes = await Note.find({userId})
    res.json({notes}).status(201)
})


//route for deleting a note with its id
notesRouter.delete('/delete/:id',isAuthenticated, async (req, res) => {
    const noteId = req.params.id
    try{
        await Note.deleteOne({_id: noteId})
    res.status(204).send()
    }catch(e){
        console.log(e)
        res.status(500).json({msg : 'failed to delete note'})
    }
})

//create route for retrieving one of your notes

notesRouter.get('/:id', isAuthenticated, async(req, res) => {
    const noteId = req.params.id
    try{
        const note = await Note.findOne({_id: noteId})
        console.log(note)
        res.json({note})
    }catch(e){
        console.log(e)
        res.status(500).json({msg: 'error while retrieving the note'})
    }
})












export default notesRouter