import express from 'express'
import User from '../models/user.js'
import bcrypt from "bcrypt"
import session from 'express-session'
-session
const userRouter = express.Router()

function isAuthenticated(req, res, next){
    if(req.session.userId){
        return next()
    }
    res.status(401).json({ error: 'Unauthorized' })
}
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
         const existingUserName = await User.findOne({ userName });
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
            userName: userName,
            email: email,
            password: hashedPassword,
            dateCreated: new Date()
        })
        await newUser.save()
        req.session.userId = newUser._id
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

//posting the data here










export default userRouter