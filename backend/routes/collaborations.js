import express from "express";
import collaborativeNote from '../models/collaboratedNote.js'
import isAuthenticated from "../utils/middleware/authentication.js";
import decodeJWTToken from "../utils/decodeToken.js";
import mongoose from "mongoose";
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
    console.log(userId)
    try{
    //     const objectId = new mongoose.Types.ObjectId(userId)
    //     const notesFound = await collaborativeNote.find({
    //           $or: [
    //     {owner: userId},
    //     {'collaborators.user': userId} // Simpler dot notation
    // ]
    //     })
    const allNotes = await collaborativeNote.find({});
console.log('All notes:', JSON.stringify(allNotes, null, 2));

// Then check your specific query
const notesFound = await collaborativeNote.find({
    $or: [
        {owner: userId},
        {'collaborators.user': userId}
    ]
});
// console.log('Notes found:', notesFound);
// console.log('UserId being searched:', userId);
        console.log(notesFound)
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
        console.log(note)
        res.render('notes/collaborativeNotes/collaborativeNoteView', {note})
    }catch(e){
        console.log(e)
        res.status(500).json({msg: e})
    }

})

//this will take the cookies or whatever and check the user if he has any collaborative 
// projects and return something








export default collaborationsRouter