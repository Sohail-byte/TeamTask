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









export default notesRouter