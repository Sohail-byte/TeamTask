import express from 'express'
import Note from '../models/note.js'
import isAuthenticated from '../utils/middleware/authentication.js'
import decodeJWTToken from '../utils/decodeToken.js'
const notesRouter = express.Router()










notesRouter.get('/create', isAuthenticated, ((req, res) => {
    res.render('notes/newNote')
}))
//creating new notes and storing the notes
notesRouter.post('/create', isAuthenticated ,async(req, res)=>{

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
        // console.log(note)
        res.render('notes/noteView', {note})
    }catch(e){
        console.log(e)
        res.status(500).json({msg: 'error while retrieving the note'})
    }
})


// route for updating the note 
notesRouter.put('/:id/update', isAuthenticated, async (req, res) => {
    const noteId = req.params.id
    const {title, summary, content} = req.body



    //idk what this does but i have read it builds the set object dynamicall
    //it can be useful when you want to partailly update like if there are three fields in my case
    //and if two fields are the same and only the third one has a change that needs to be updated in the database
    console.log('PUT body:', req.body)
    const $set = {}
    //this is like doing homweork but you gotta do what you gotta do to learn
    //this Object.proto type.has own property checks if the object has the property in it like the req.body is an object
    //this checks it that object is empty or preset(if it isnt present then its empty i guess) to update the db with partial data or only
    //with the data that is given in the request
    //this was my explanantion and this is a hard concept and i have not even fully learned it but i have to look this up and how to define good routes and whatnot.
    //
    //this was like the validation phase maybe(defensive programming)
    if (Object.prototype.hasOwnProperty.call(req.body, 'title')) $set.title = req.body.title
    if (Object.prototype.hasOwnProperty.call(req.body, 'summary')) $set.summary = req.body.summary
    if (Object.prototype.hasOwnProperty.call(req.body, 'content')) $set.content = req.body.content
    //this checks if all the fields are empty
    if (Object.keys($set).length === 0) {
    return res.status(400).json({ msg: 'No fields provided' })
  }
    try{
        const updated = await Note.findOneAndUpdate(
            {_id: noteId},
            {$set}
        )
        if(!updated){
            return res.status(404).json({ msg: 'note not found' })
        }
        res.status(200).json({ msg: 'note updated successfully'})

    }catch(e){
        console.log(e)
        res.status(500).json({msg: 'failed to update the note'})
    }


})










export default notesRouter