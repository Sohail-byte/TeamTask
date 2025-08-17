import express from 'express'
import User from '../models/user.js'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { createTokenPayload } from '../utils/auth.js'
const userRouter = express.Router()

//signup page
//get request to load the signup page (signup.ejs)
userRouter.get('/signup', (req, res) =>{
    res.render('user-forms/signup.ejs', {error: null});
    })
//post route for making new user
userRouter.post('/signup', async(req, res)=>{
    const {userName, email, password} = req.body
    const lowerCaseUsername = userName.toLowerCase()
    try{
         const existingUserName = await User.findOne({ userName: lowerCaseUsername });
         const existingUserEmail = await User.findOne({ email });
//check if the email already exists or username
// Render the form again with error
    if (existingUserName || existingUserEmail) {
        if(existingUserName && existingUserEmail){
            return res.render('user-forms/signup.ejs', { error: 'Username and email Already in use' });
        } else if(existingUserName){
            return res.render('user-forms/signup.ejs', { error: 'Username already in use.' });
        } else{
            return res.render('user-forms/signup.ejs', { error: 'Email already in use.' });
        }
    }
    
    
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            userName: lowerCaseUsername,
            email: email,
            password: hashedPassword,
            dateCreated: new Date()
        })
        await newUser.save()
        const userId = await User.findOne({userName})._id
        // const token = createTokenPayload({userId})

        


        // console.log(token)
        // res.cookie('token', token, {maxAge: 86400000})
        // res.redirect('/dashboard')


    }catch(e){
        console.log(e)
        res.status(500).json({msg: `${e}`})
    }
})





//login page
userRouter.get('/login', (req, res) =>{
    if(req.cookies.token){
        res.redirect('/dashboard')
    }else{
        res.render('user-forms/login.ejs', {error: null})
    }
    
     
} )

userRouter.post('/login', async (req, res) => {
    //check email and password type
    let {email, password} = req.body
    
    console.log(email, password)
    try{
        const userFound = await User.findOne({ email: email })

        if (!userFound) {
            return res.status(400).render('user-forms/login', {error: 'user not found'});
        }

        const passMatch = await bcrypt.compare(password, userFound.password);
        if (!passMatch) {
            return res.status(400).render('user-forms/login', {error: 'invalid password'})
        }

        const userId = userFound._id
        const token = createTokenPayload({userId})
        res.cookie('token', token, {maxAge: 86400000})
        res.redirect('/dashboard')

    } catch(e){
        console.log(e)
        res.status(500).json({msg: `${e}`})
    }
    
})











//logout route
userRouter.get('/logout', async (req, res) => {
    try{
    res.clearCookie('token')
    res.redirect('/login')
}catch(e){
    console.log(e)
}
})









export default userRouter