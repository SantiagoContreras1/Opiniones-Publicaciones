import { Schema,model } from "mongoose";

const PublicationSchema = Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    estado:{
        type: Boolean,
        default: true,
        required: true
    },
    comentarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true,"El user es requerido, pelotudote."]
    }
})

PublicationSchema.methods.toJSON= function () {
    const {__v,_id,...publication} = this.toObject()
    publication.uid= _id
    return publication
}

export default model('Publication',PublicationSchema)