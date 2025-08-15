function isAuthenticated(req, res, next){
    if(req.cookies.token){
        return next()
    }
    return res.status(401).json({msg: 'unauthorized'})
}

export default isAuthenticated