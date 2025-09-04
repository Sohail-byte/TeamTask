function isAuthenticated(req, res, next){
    if(req.cookies.token){
        //check if the userid in the token is related to the user in the database, then let it continue
        return next()
    }
    return res.status(401).json({msg: 'unauthorized'})
}

export default isAuthenticated
///change this to check and cross reference the user id to db