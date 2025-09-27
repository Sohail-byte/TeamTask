import jwt from 'jsonwebtoken'

const decodeJWTToken = (token)=>{
     const decodedtoken = jwt.decode(token)
     return decodedtoken
}

export default decodeJWTToken
