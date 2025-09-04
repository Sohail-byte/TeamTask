import express from "express";
import collaborativeNote from '../models/collaboratedNote.js'
import isAuthenticated from "../utils/middleware/authentication.js";
import decodeJWTToken from "../utils/decodeToken.js";
import mongoose from "mongoose";
import User from '../models/user.js'
const collaborationsRouter = express.Router()


//im going to use the router for the pathc collaborations/create... and so on




//i need to add users to the collabers and check what typoe of permissions they have then allot them 
//controls like who can vieww and who can edit
collaborationsRouter.get('/create',isAuthenticated, async(req, res) => {
    res.render('notes/collaborativeNotes/newCollaborativeNote')
})


collaborationsRouter.post('/create',isAuthenticated, async(req, res) =>{
    const {title, summary, content} = req.body

    const decodedToken = decodeJWTToken(req.cookies.token)
    const userId = decodedToken?.payload?.userId

    try{
        const newCollaborativeNote = await new collaborativeNote({
            title,
            summary,
            content,
            owner: userId
        }).save()
        res.status(201).redirect('/dashboard')
    }catch(e){
        console.log(e)
        res.status(500).json({msg: e})
    }
})






//this route retrieves all the collaborative notes the user has
//have to implement the functionality

//currently checking if he is either the owner or a collaborator in anothers notes
//just getting the basic and flawed logic down first and going to secure it later.
collaborationsRouter.get('/',isAuthenticated, async(req, res) => {
    const decodedToken = decodeJWTToken(req.cookies.token)
    const userId = decodedToken?.payload?.userId
    // console.log(userId)
    try{

    // Then check your specific query
    const notesFound = await collaborativeNote.find({
    $or: [
        {owner: userId},
        {'collaborators.user': userId}
    ]
});
        // console.log(notesFound)
        res.json({notesFound})
    }catch(e){
        console.log(e)
        res.status(500).json({msg: e})
    }
})



//getting a note from database to view
collaborationsRouter.get('/:id', isAuthenticated ,async (req, res) => {
    const id = req.params.id
    try{
        const note = await collaborativeNote.findOne({_id: id})
        // console.log(note)
        res.render('notes/collaborativeNotes/collaborativeNoteView', {note})
    }catch(e){
        console.log(e)
        res.status(500).json({msg: e})
    }

})



//updating the collaboration notes (have to make it so that only the owner or authorized man can delete this(maybe only the owner))
collaborationsRouter.put('/:id/update', isAuthenticated, async (req, res) => {
    const noteId = req.params.id
    const {title, summary, content} = req.body
    const $set = {}
    //check if all this is necessary for this application using ejs beacause the fields will not let you 
    if (Object.prototype.hasOwnProperty.call(req.body, 'title')) $set.title = req.body.title
    if (Object.prototype.hasOwnProperty.call(req.body, 'summary')) $set.summary = req.body.summary
    if (Object.prototype.hasOwnProperty.call(req.body, 'content')) $set.content = req.body.content

    if (Object.keys($set).length === 0) {
    return res.status(400).json({ msg: 'No fields provided' })
     }

     try{
        const updated = await collaborativeNote.findOneAndUpdate(
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



//route for deleting the collab note
collaborationsRouter.delete('/:id/delete', isAuthenticated, async (req, res) => {
    const noteId = req.params.id
    try{
        await collaborativeNote.deleteOne({_id: noteId})
        res.status(204).send()
    }catch(e){
        console.log(e)
        res.status(500).json({msg : 'failed to delete note'})
    }
})



//making route to retrieve the collaborators of a certain note
collaborationsRouter.get('/:id/collaborators', isAuthenticated, async(req, res) =>{
    const id = req.params.id
    try{
        const note = await collaborativeNote.findOne({_id: id})
        const collaboraters = note.collaborators
        res.json({collaboraters})
    }catch(e){
        console.log(e)
        res.status(500).json({msg : 'failed'})
    }
} )



//adding collaborators to a note


//when taking input from user, make sure to transform the input into lowercase, and also display any errors
//if the user is not found
collaborationsRouter.post('/:id/collaborator/add/:userName',isAuthenticated, async(req,res)=>{
    const {id, userName} = req.params
    try{
        const user = await User.findOne({userName})
        if(!user){
            return res.status(404).json({error: 'user not found'})
        }
        const userId = user._id
        await collaborativeNote.findOneAndUpdate(
                      {_id: id}, 
                      {
                        $addToSet: {
                          collaborators: {
                            user: userId,
                            permissions: 'read',
                            username: userName
                          }
                        }
                      }
                    )
        res.status(200).json({res: 'User added successfully'})
    }catch(e){
        console.log(e)
        res.status(500).json({msg : 'failed to add collaborator'})
    }
})







export default collaborationsRouter