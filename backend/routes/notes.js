import express from 'express'
import Note from '../models/note.js'
import isAuthenticated from '../utils/middleware/authentication.js'
import decodeJWTToken from '../utils/decodeToken.js'
const notesRouter = express.Router()










notesRouter.get('/create', isAuthenticated, ((req, res) => {
    res.render('notes/newNote')
}))

notesRouter.post('/create', async(req, res)=>{

    const {title, content} = req.body
    const tokenPayload = decodeJWTToken(req.cookies.token)
    console.log(tokenPayload)
    // console.log({title, content})
    try{
        const newNote = await new Note({
            title,
            content,
            userId: tokenPayload.userId
        }).save()
        res.status(201).redirect('/dashboard')
    }catch(e){
        console.log(e)
        res.status(500).json({msg: "failed to save note"})
    }

})









export default notesRouter