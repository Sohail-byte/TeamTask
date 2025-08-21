import jwt from 'jsonwebtoken'

const decodeJWTToken = (token)=>{
     const decodedtoken = jwt.decode(token)
}

export default decodeJWTToken
