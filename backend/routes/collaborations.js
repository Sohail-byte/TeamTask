import express from "express";
const collaborationsRouter = express.Router()


//im going to use the router for the pathc collaborations/create... and so on




//i need to add users to the collabers and check what typoe of permissions they have then allot them 
//controls like who can vieww and who can edit
collaborationsRouter.get('/create', async(req, res) => {
    res.render('notes/collaborativeNotes/newCollaborativeNote')
})









//this route retrieves all the collaborative notes the user has
//have to implement the functionality
collaborationsRouter.get('/', (req, res) => {
    res.json({}).status(201)
})

//this will take the cookies or whatever and check the user if he has any collaborative 
// projects and return something








export default collaborationsRouter