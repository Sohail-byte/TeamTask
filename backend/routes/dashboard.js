import express from 'express'
import isAuthenticated from '../utils/middleware/authentication.js'
const dashboardRouter = express.Router()

dashboardRouter.get('/dashboard', isAuthenticated, (req, res) => {
//get the user from the token and display its name and send the data to ejs file to make queries ......and also assign user authorization like what changes can the user do to the notes.
    console.log(req.cookies)
    res.render('dashboard.ejs')
})

export default dashboardRouter