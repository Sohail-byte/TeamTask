import express from 'express'
import User from '../models/user.js'
import Token from '../models/token.js'

const emailAuthenticationRouter = express.Router()

emailAuthenticationRouter.get('/users/:id/verify/:token', async (req, res) => {
    const {id, token} = req.params
    const user = await User.findOne({_id: id})
    if(!user) return res.status(400).send({ message: "Invalid link" })

    const authToken = await Token.findOne({userId: user._id, token})
    if (!token) return res.status(400).send({ message: "Invalid link" });

    if(authToken){
    await User.updateOne({_id: user._id}, {emailValidated: true})
    await authToken.deleteOne();
    res.status(200).send('<h1>Email verrified successfully</h1>')
    } else{
        return res.status(400).send({ message: "Invalid link" })
    }
})
export default emailAuthenticationRouter