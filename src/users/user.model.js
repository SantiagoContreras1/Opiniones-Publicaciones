import { Schema,model } from "mongoose";

const UserSchema = Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true,'El email es requerido!!!!!!'],
        unique: true
    },
    password: {
        type: String,
        required: [true,'El password es requerido!!!!!!']
    },
    role:{
        type: String,
        required: [true,'El rol es requerido!!!!!!'],
        enum: ['ADMIN_ROLE','USER_ROLE'],
        default: 'USER_ROLE'
    },
    estado:{
        type: Boolean,
        default: true,
        required: true
    }
})

UserSchema.methods.toJSON = function () {
    const {__v,password,_id,...user} = this.toObject()
    user.uid = _id
    return user
}

export default model('User',UserSchema)