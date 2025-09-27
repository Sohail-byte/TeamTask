const TOKEN_NAME = 'token'
import jwt from "jsonwebtoken"

/**
 * creates a token payload from provided data
 * @param {{userId: string}} payload 
 * @returns string
 */
export function createTokenPayload(payload){
    if(typeof payload !== 'object'){
        throw new Error('The payload must be an object')
    }
    if(!payload.userId || typeof payload.userId !== 'string'){
        throw new Error('Either userId property doesnt exist or isnt a String')
    }
    const token = jwt.sign({payload}, process.env.SECRET_KEY)
    return token
}


