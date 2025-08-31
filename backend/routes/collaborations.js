import express from "express";
import collaborativeNote from '../models/collaboratedNote.js'
import isAuthenticated from "../utils/middleware/authentication.js";
import decodeJWTToken from "../utils/decodeToken.js";
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
collaborationsRouter.get('/',isAuthenticated, async(req, res) => {
    res.render('notes/collaborativeNotes/collaborativeNoteView')
})

//this will take the cookies or whatever and check the user if he has any collaborative 
// projects and return something








export default collaborationsRouter