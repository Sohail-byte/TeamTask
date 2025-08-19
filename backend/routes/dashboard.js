import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import isAuthenticated from '../utils/middleware/authentication.js'
const dashboardRouter = express.Router()

dashboardRouter.get('/dashboard', isAuthenticated, async (req, res) => {
    try{
        const jwtToken = req.cookies.token
        const decodedToken = await jwt.decode(jwtToken).payload.userId
        const userFound = await User.findOne({_id: decodedToken})
        // console.log(userFound)
         res.render('dashboard.ejs', {userName : userFound.userName})
    }catch(e){
        console.log(e)
        res.status(500).json({msg: `${e}`})
    }
//get the user from the token and display its name and send the data to ejs file to make queries ......and also assign user authorization like what changes can the user do to the notes.
   
})

export default dashboardRouter

//made a seperate file about the dashboard route. adding functionality to queryyt the notes of the user when loading the database. have to make the notes model and crud functionality for it and ajax request the notes from the database and display them on the page


//make new file for notes route, adding notes deleting notes etc. retrieving them would be later task
