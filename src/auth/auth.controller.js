import { hash,verify } from "argon2";
import User from "../users/user.model.js"
import {generarJWT} from "../helpers/generar-JWT.js"

export const register = async (req,res) => {
    try {
        const data = req.body // accede a la data del body
        const encryptedPassword = await hash(data.password) // Encriptar la password

        const user = await User.create({ // Crear usuario
            name: data.name,
            email: data.email,
            password: encryptedPassword,
            role: data.role
        })

        res.status(200).json({
            message: "Usuario creadooooo",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Error al registrar usuario",
            error: error.message
        })
    }
}

export const login = async (req, res) => {
    const {email,password} = req.body

    try {
        const user = await User.findOne({email})

        // ⚠️ VALIDACIONES ⚠️
        if(!user){
            return res.status(404).json({
                message: "Usuario no encontrado"
            })
        }

        // Revisar si el usuario se le hizo un delete
        if (!user.estado) {
            return res.status(400).json({
                message: "Usuario inactivo"
            })
        }

        // 🔐 Comparar contraseñas con argon2
        const validPassword = await verify(user.password,password)
        if(!validPassword){
            return res.status(400).json({
                message: "Contraseña incorrecta"
            })
        }

        const token = await generarJWT(user.id)
        return res.status(200).json({
            message: "Usuario autenticado",
            userDetails:{
                id: user.id,
                name: user.name,
                email: user.email,
                token: token
            }
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Error al iniciar sesión",
            error: error.message
        })
    }

}