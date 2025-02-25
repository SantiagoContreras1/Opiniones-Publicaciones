import Category from "./category.model.js";
import User from "../users/user.model.js"

export const saveCategory = async (req,res) => {
    try {
        const {name,description} = req.body
        const category = new Category({name,description})

        await category.save()

        res.status(200).json({
            message:"Category saved successfully",
            category
        })
    } catch (error) {
        res.status(500).json({
            message: "Error saving category",
            error: error.message
        })
    }
}

export const getCategories = async (req,res) => {
    try {
        const query = {estado:true}

        const [total,categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
        ])

        res.status(200).json({
            success: true,
            total,
            categories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        })
    }
}

export const deleteCategory = async (req,res) => {
    try {
        const {id} = req.params

        if (req.user.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                succes: false,
                message: "No tienes permisos para eliminar un usuario"
            })
        }

        const category = await Category.findByIdAndUpdate(id,{estado:false},{new:true})

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Category deleted :C",
            category
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message: "Error deleting category",
            error: error.message
        })
    }
}

export const updateCategory = async (req,res) => {
    try {
        const {id} = req.params
        const {...data} = req.body

        if (req.user.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                succes: false,
                message: "No tienes permisos para eliminar un usuario"
            })
        }

        const category = await Category.findByIdAndUpdate(id,data,{new:true})

        res.status(200).json({
            success: true,
            message: "Category updated",
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating category",
            error: error.message
        })
    }
}