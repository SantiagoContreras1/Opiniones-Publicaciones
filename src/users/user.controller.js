import { response,request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req,res) => {
    try {
        const query = {estado:true}

        const [total,users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ])

        res.status(200).json({
            succes:true,
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
            succes:true,
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
        console.log("REQ.BODY:", req.body); // Muestra el cuerpo completo de la petición
        const {id} = req.params
        const {role,password,...data} = req.body
        console.log("PASSWORD:", password); // Verifica si el password llega


        if(req.user.role === 'USER_ROLE' && id !== req.user._id.toString()){
            return res.status(403).json({
                succes: false,
                message: "No tenes permiso para editar un usuario, boludito"
            })
        }
        
        if (password) {
            console.log('PELOTUDO 4')
            data.password = await hash(password)
        }
        
        const user = await User.findByIdAndUpdate(id,data,{new:true})
        
        if (!user) {
            return res.status(404).json({
                succe: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            succes:true,
            msg: 'Usuario actualizado pelotudo!!!',
            user
        })

    } catch (error) {
        res.status(500).json({
            message: "Error updating user",
            error: error.message
        })
    }
}