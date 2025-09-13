import express from 'express'
import User from '../models/user.js'
import bcrypt from "bcrypt"
import { createTokenPayload } from '../utils/auth.js'
import Token from '../models/token.js'
import { sendEmailAuthentication } from '../utils/sendEmail.js'
import crypto from 'crypto'
import decodeJWTToken from '../utils/decodeToken.js'
const loginRouter = express.Router()

//login page 
loginRouter.get('/login', (req, res) =>{
   if(req.cookies.token){
    const decodedToken = decodeJWTToken(req.cookies.token)
    const userId = decodedToken?.payload?.userId
    try{
        const userFound = User.findOne({_id: userId})
        if(userFound){
            return res.redirect('/dashboard')
        }
    }catch(e){
        console.log(e)
        res.status(500).json({e: 'something went wrong!'})
    }
}else res.render('user-forms/login.ejs', {error: null})
} )

loginRouter.post('/login', async (req, res) => {
    //check email and password type - todo
    let {email, password} = req.body
    try{
        const userFound = await User.findOne({ email: email })
        // console.log(userFound)
        if (!userFound) {
            return res.status(400).render('user-forms/login', {error: 'user not found'});
        } else if(userFound.emailValidated){
            const passMatch = await bcrypt.compare(password, userFound.password);
        if (!passMatch) {
            return res.status(400).render('user-forms/login', {error: 'invalid password'})
        }

        const userId = String(userFound._id)
        const token = createTokenPayload({userId: userId})
        res.cookie('token', token, {maxAge: 86400000})
        res.redirect('/dashboard')

        }else{
            
            //check if token exists, if not, then create a new auth token for this. not the session/jwt token, but the email auth token
            const existingAuthToken = await Token.findOne({userId: userFound._id})
            console.log(existingAuthToken)
            if(!existingAuthToken){
                console.log('token not found, creating new one')
                const verificationToken =  await new Token({
                userId: userFound._id,
                token: crypto.randomBytes(32).toString('hex')
        }).save()

            const url = `<a href="${process.env.BASE_URL}/users/${userFound._id}/verify/${verificationToken.token}">Click this link</a>`
            await sendEmailAuthentication(email, 'Verify Email', url)
            res.status(400).render('user-forms/login', {error: 'Please verify your email. An email has been sent to your email account'})
        }
            return res.status(400).render('user-forms/login', {error: 'Email not authenticated. An email has been sent to your email account.'})
        }

        

    } catch(e){
        console.log(e)
        res.status(500).json({msg: `${e}`})
    }
    
})











//logout route
loginRouter.get('/logout', async (req, res) => {
    try{
    res.clearCookie('token')
    res.redirect('/login')
}catch(e){
    console.log(e)
}
})







export default loginRouter