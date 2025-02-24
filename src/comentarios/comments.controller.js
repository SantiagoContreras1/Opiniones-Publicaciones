import User from "../users/user.model.js"
import Publication from "../publicaciones/publication.model.js"
import Comment from "./comment.model.js"

export const saveComent = async (req,res) => {
    try {
        const {text,publicationId} = req.body // Obtener el texto del comentario
        const publication = await Publication.findById(publicationId);
        const user = await User.findById(req.user._id)

        if (!publicationId) {
            return res.status(404).json({
                success: false,
                msg: "No encontramos el ID de la pulicación, papu."
            })
        }

        if (!publication) {
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
            publication: publication._id
        })

        await comment.save()

        // AGREGAR AL ARRAY DE LA PUBLICACION
        publication.comentarios.push(comment._id)
        await comment.save()

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