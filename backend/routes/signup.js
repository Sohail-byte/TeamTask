import express from 'express'
import User from '../models/user.js'
import bcrypt from "bcrypt"
import Token from '../models/token.js'
import crypto from 'crypto'
import { sendEmailAuthentication } from '../utils/sendEmail.js'
const signupRouter = express.Router()

//signup page
//get request to load the signup page (signup.ejs)
signupRouter.get('/signup', (req, res) =>{
    res.render('user-forms/signup.ejs', {error: null});
    })



//post route for making new user
signupRouter.post('/signup', async(req, res)=>{
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
        

        const verificationToken =  await new Token({
            userId: newUser._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save()
        

        
        const url = `<a href="${process.env.BASE_URL}/users/${newUser._id}/verify/${verificationToken.token}">Click this link</a>`
        await sendEmailAuthentication(newUser.email, 'Verify Email', url)
        res.status(201).render('user-forms/signup.ejs', {error: 'Please verify your email. An email has been sent to your email account'})
        
        // const token = createTokenPayload({userId})
        // console.log(token)
        // res.cookie('token', token, {maxAge: 86400000})
        // res.redirect('/dashboard')


    }catch(e){
        console.log(e)
        res.status(500).json({msg: `${e}`})
    }
})


export default signupRouter