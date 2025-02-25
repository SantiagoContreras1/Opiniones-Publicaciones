import mongoose from "mongoose";

const RolSchema = mongoose.Schema({
    rol:{
        type: String,
        required: [true,'El rol es obligatorio']
    }
})

export default mongoose.model('Role',RolSchema)