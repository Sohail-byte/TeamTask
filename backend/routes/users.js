import express from 'express'
import User from '../models/user.js'
import bcrypt from "bcrypt"
const userRouter = express.Router()

//making routes for:
//login
//signup

//signup page
//get request to load the signup page (signup.ejs)
userRouter.get('/signup', (req, res) =>{
    res.render('user-forms/signup.ejs')
} )
//post route for making the user
userRouter.post('/signup', async(req, res)=>{
    try{
        const newUser = new User(req.body)
        await newUser.save()
        res.send('user successfully')
    }catch(e){
        console.log(e)
        res.status(500).json({msg: `${e}`})
    }
})











//login page
userRouter.get('/login', (req, res) =>{
    res.render('user-forms/login.ejs')    
} )






export default userRouter