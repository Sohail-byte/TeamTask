import User from '../../models/user.js'
import decodeJWTToken from '../decodeToken.js'

async function isAuthenticated(req, res, next){
    if(req.cookies.token){
        const decodedToken = decodeJWTToken(req.cookies.token)
        const userId = decodedToken?.payload?.userId
        const userFound = await User.find({_id: userId})
        if(!userFound){
            return res.status(401).json({msg: 'unauthorized'})
        }
        return next()
    }
    return res.status(401).json({msg: 'unauthorized'})
}

export default isAuthenticated
