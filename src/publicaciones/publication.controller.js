import Category from "../categories/category.model.js"
import User from "../users/user.model.js"
import Publication from "./publication.model.js"

export const postPublication = async (req,res) => {
    try {
        const data = req.body
        const user = await User.findById(req.user._id)
        const category = await Category.findById(data.category)

        if (!category) {
            return res.status(404).json({
                success:false,
                message: "Category not found"
            })
        }

        if (!user) {
            return res.status(404).json({
                success:false,
                message: "User not found"
            })
        }

        const publication = new Publication({
            title: data.title,
            text: data.text,
            category: category._id,
            user: user._id
        })
        await publication.save()

        // Recuperamos la publicación desde la BD con populate() de mongoose
        const populatePublication = await Publication.findById(publication._id)
            .populate("category")
            .populate("user")

        res.status(200).json({
            message: "Publication created!!!!!!",
            publication: populatePublication
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al crear la publicación",
            error: error.message
        })
    }
}

export const updatePublication = async (req,res) => {
    try {
        const {id} = req.params
        const {_id,user,...data} = req.body

        if (!user) {
            return res.status(404).json({
                success:false,
                message: "User not found bro."
            })
        }

        const publication = await Publication.findById(id).populate("user")

        if (!publication) {
            return res.status(404).json({
                success:false,
                message: "Publication not found boludin."
            })
        }

        // Valido los permisos antes de continuar
        if(req.user.role === 'USER_ROLE' && publication.user._id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                ss: false,
                message: "No tenes permiso para editar esta publicación que no es tuya. Payaso."
            })
        }

        Object.assign(publication,data)
        await publication.save()

        res.status(200).json({
            message: "Publication updated!!!!!!",
            publication: publication
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar la publicación",
            error: error.message
        })
    }
}

export const getPublications = async (req,res) => {
    const query = {estado:true}
    try {
        const publications = await Publication.find(query)
            .populate({
                path: "comentarios",
                populate: {
                    path: "user",
                    select: "name"
                }
            })
            .populate("user") // traer solo el nombre del usuario
            .populate("category", "name"); // traer solo el nombre de la categoría

        const publicationsWithUsers = await Promise.all(
            publications.map(async (publication) => {
                const userOfPost = await User.findById(publication.user)

                return{
                    ...publication.toObject(),
                    user: userOfPost ? userOfPost.name : "User not found"
                }

            })
        )

        const posts = await Publication.countDocuments(query)

        res.status(200).json({
            posts: posts,
            publications: publicationsWithUsers
        })


    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las publicaciones brother.",
            error: error.message
        })
    }
}

export const deletePublication = async (req,res) => {
    const {id} = req.params
    try {
        const publication = await Publication.findById(id)

        if (!publication) {
            return res.status(404).json({
                ss:false,
                message: "Publicación no encontrada payaso"
            })
        }

        // Valido los permisos antes de continuar
        if(req.user.role === 'USER_ROLE' && publication.user._id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                ss: false,
                message: "No tenes permiso para borrar una publicación que no es tuya. Payaso."
            })
        }

        publication.estado = false
        await publication.save()

        res.status(200).json({
            ss: true,
            message: "Publicación eliminada con éxito pelotudito!"
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar la publicación pelotudo",
            error: error.message
        })
    }
}