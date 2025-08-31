import express from "express";
const collaborationsRouter = express.Router()


//im going to use the router for the pathc collaborations/create... and so on


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