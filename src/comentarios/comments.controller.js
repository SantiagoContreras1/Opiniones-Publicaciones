import User from "../users/user.model.js"
import Publication from "../publicaciones/publication.model.js"
import Comment from "./comment.model.js"

export const saveComent = async (req,res) => {
    try {
        const {text,publication} = req.body // Obtener el texto del comentario
        const post = await Publication.findById(publication);
        const user = await User.findById(req.user._id)
        
        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: "No encontramos el ID de la pulicación, papu."
            })
        }

        if (!post) {
            return res.status(404).json({
                success: false,
                msg: "No encontramos la pulicación, papu."
            })
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "No encontramos al user, papu."
            })
        }

        const comment = new Comment({
            text,
            user: user._id,
            publication
        })

        // AGREGAR AL ARRAY DE LA PUBLICACION
        post.comentarios.push(comment._id)
        await post.save() // Guardar los cambios en la publicación
        await comment.save() // Guardar el comentario

        res.status(200).json({
            success: true,
            msg: "Comentario agregado con éxito boludín!!!",
            comment
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const updateComment = async (req,res) => {
    try {
        const {id} = req.params
        const {_id,user,...data} = req.body

        const updatedComment = await Comment.findByIdAndUpdate(id,data,{new:true})

        if (!updatedComment) {
            return res.status(404).json({
                success: false,
                msg: "No encontramos el comentario, papu."
            })
        }

        if (req.user.role === 'USER_ROLE' && updatedComment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permisos para editar este comentario boludín!!!"
            })
        }

        res.status(200).json({
            success: true,
            msg: "Comentario actualizado con éxito boludín!!!",
            updatedComment
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const deleteComment = async (req,res) => {
    const {id} = req.params
    try {
        const comment = await Comment.findByIdAndUpdate(id,{estado:false})

        if (req.user.role === 'USER_ROLE' && comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permisos para borrar este comentario pelotudaso!!!"
            })
        }

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: "No encontramos el comentario, papu."
            })
        }

        res.status(200).json({
            success: true,
            msg: "Comentario eliminado con éxito boludín!!!",
            comment
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}