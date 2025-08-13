function isAuthenticated(req, res, next){
    if(req.session.userId){
        return next()
    }
    return res.status(401).json({msg: 'unauthorized'})
}

export default isAuthenticated