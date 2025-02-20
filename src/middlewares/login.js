import { body } from "express-validator";
import {validarCampos} from "../middlewares/validar-campos.js"
import { existEmail } from "../helpers/db-validator.js";

export const registerValidator=[
    body("name").not().isEmpty().withMessage('El nombre es obligatorio'),
    body("email",'Ingresa un email válido').not().isEmpty(),
    body("email").custom(existEmail),
    body("password","La contraseña debe de ser de un mínimo de 6 caracteres").isLength({min:6}),
    validarCampos
]

export const loginValidator=[
    body("email").optional().isEmail().withMessage('Ingresa un email válido'),
    body("password","La contraseña es inválida ").isLength({min:6}),
    validarCampos
]