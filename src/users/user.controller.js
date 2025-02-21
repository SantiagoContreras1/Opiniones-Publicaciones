import { response,request } from "express";
import { hash,verify } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req,res) => {
    try {
        const query = {estado:true}

        const [total,users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ])

        res.status(200).json({
            success:true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        })
    }
}

export const searchUser = async (req,res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
        res.status(500).json({
            message: "Error searching user",
            error: error.message
        })
    }
}

export const updateUser = async (req,res) => {
    try {
        const {id} = req.params
        const {role,passwordOld,passwordNew,...data} = req.body

        // Busco el user primero
        const user = await User.findById(id)   
        if (!user) {
            return res.status(404).json({
                succe: false,
                message: "User not found"
            })
        }

        // Valido los permisos antes de continuar
        if(req.user.role === 'USER_ROLE' && id !== req.user._id.toString()){
            return res.status(403).json({
                ss: false,
                message: "No tenes permiso para editar un usuario, boludito"
            })
        }

        // Verificar y actualizar la password
        if (passwordOld && passwordNew) {
            const verificarIgualdad = await verify(user.password, passwordOld) // Comparamos la contraseña antigua con la almacenada
            if (!verificarIgualdad) {
                return res.status(403).json({
                    ss: false,
                    message: "Password anterior is incorrect"
                })
            }
            data.password = await hash(passwordNew) // Encriptar la contraseña
        }

        const userUpdated = await User.findByIdAndUpdate(id,data,{new:true})

        res.status(200).json({
            success:true,
            msg: 'Usuario actualizado pelotudo!!!',
            user: userUpdated
        })

    } catch (error) {
        res.status(500).json({
            message: "Error updating user",
            error: error.message
        })
    }
}