import express from "express"
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcrypt";
import {hash} from "argon2";
import { dbConnection } from "./mongo.js";

import authRoutes from "../src/auth/auth.router.js"
import userRoutes from "../src/users/user.routes.js"
import categoriesRoutes from "../src/categories/categories.routes.js"
import publicationRoutes from "../src/publicaciones/publication.routes.js"
import commentsRoutes from "../src/comentarios/comments.routes.js"

import User from "../src/users/user.model.js"
import Category from "../src/categories/category.model.js"

let flag = true
let categoryFlag = true

const middlewares = (app)=>{
    app.use(express.urlencoded({extended: false})) //Para los forms
    app.use(express.json()) // Para que JS entienda los JSON
    app.use(cors()) // dominios que pueden acceder
    app.use(helmet()) // Es para la seguridad
    app.use(morgan('dev')) // Muestra mensajes para nuestras rutas (POST,PUT etc)
}

//RUTAS
const routes = (app)=>{
    app.use("/publicationsSystem/auth",authRoutes)
    app.use("/publicationsSystem/users",userRoutes)
    app.use("/publicationsSystem/categories",categoriesRoutes)
    app.use("/publicationsSystem/publication",publicationRoutes)
    app.use("/publicationsSystem/comments",commentsRoutes)
}

const conectarDb = async () => {
    try {
        await dbConnection();
        console.log('DB Online');
    } catch (error) {
        console.log('Error al conectarse a la DB',error)
    }
}

// FUNCION ADMIN POR DEFECTO
export const crearAdmin = async () => {
    try {
        const exixteAdmin = await User.findOne({email:'admin@admin.com'})

        if (!exixteAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await hash('1234567',salt)

            const adminUser = await User.create({ // Crear usuario
                name: 'Admin',
                email: 'admin@admin.com',
                password: hashedPass,
                role: 'ADMIN_ROLE'
            })

            await adminUser.save()
            console.log('El admin de discord ha sido creado.')
            flag=false
        }else{
            console.log('Ya hay un admin de discord.')
        }
    } catch (error) {
        return console.log(error)
    }
}

// Categorias por defecto
export const crearCategoria = async () => {
    try {
        const defaultCategory = await Category.findOne({name:"Animales Domésticos"})

        if (!defaultCategory) {
            const category = await Category.create({
                name: "Animales Domésticos",
                description: "Categoría de animales domésticos"
            })
            await category.save()
            console.log('Categoría inicial creada')
            
        }else{
            console.log('La categoría ya existe')
        }
    } catch (error) {
        console.log('No pudimos crear la categoria baluk.')
    }
}

export const initServer = ()=>{
    const app = express() // crea el server
    const port= process.env.PORT || 3003

    try {
        middlewares(app)
        conectarDb()
        routes(app)
        app.listen(port)
        console.log(`Server running on port ${port}`)

        if (flag == true) {
            crearAdmin()
        }

        if (categoryFlag) {
            crearCategoria()
        }
    } catch (error) {
        console.log(`Server init failed ${error}`)
    }
}