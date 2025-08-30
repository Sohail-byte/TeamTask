import express from "express";
const collaborationsRouter = express.Router()


collaborationsRouter.get('/collaborations', (req, res) => {
    res.json({}).status(201)
})

//this will take the cookies or whatever and check the user if he has any collaborative projects and return something








export default collaborationsRouter