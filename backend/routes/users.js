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
    res.render('user-forms/signup.ejs', {error: null});
    })
//post route for making the user
userRouter.post('/signup', async(req, res)=>{
    const {userName, email, password} = req.body
    try{
         const existingUser = await User.findOne({ email });
    if (existingUser) {
      //check if the email already exists
      // Render the form again with error
      return res.render('user-forms/signup.ejs', { error: 'Email already in use.' });
    }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            userName: userName,
            email: email,
            password: hashedPassword,
            dateCreated: new Date()
        })
        await newUser.save()
        // res.send('user successfully')
        res.redirect('/user/dashboard')
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