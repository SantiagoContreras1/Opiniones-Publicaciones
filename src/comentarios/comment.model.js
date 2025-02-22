import { Schema, model } from "mongoose";

const CommentSchema = Schema({
    contenido: { type: String, required: true },
    publication: {
        type: Schema.Types.ObjectId,
        ref: 'Publication',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    }
});

CommentSchema.methods.toJSON = function () {
    const { __v, _id, ...comment } = this.toObject();
    comment.uid = _id;
    return comment;
};

export default model('Comment', CommentSchema);
