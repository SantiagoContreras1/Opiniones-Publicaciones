import {Schema,model} from "mongoose";

const CategoryModel = Schema({
    name: {type:String,required:true},
    description: {type:String,required:true},
    publicaciones: [],
    estado:{
        type:Boolean,
        default:true
    }
})

CategoryModel.methods.toJSON = function () {
    const {__v,_id,...category} = this.toObject()
    category.uid = _id
    return category
}

export default model('Category',CategoryModel)