import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: [true, 'username should be unique'],
        trim: true,
        minLength: 3,
        maxLength: 30,
        validate:{
            validator: function(username){
                const nameRegex = /^[a-zA-Z\s]*$/
                return nameRegex.test(username)
            }
        }
    },
    email: {
        type: String,
        unique: [true, 'email should be unique'],
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    dateCreated: {
        type: String,
    }
})

const User = mongoose.model('User', userSchema)
export default User