import {Router} from "express"
import { check } from "express-validator"
import { getUsers,searchUser,updateUser } from "./user.controller.js"
import {existentUserById} from "../helpers/db-validator.js"
import { validarCampos } from "../middlewares/validar-campos.js"
import {validarJWT} from "../middlewares/validar-JWT.js"

const router = Router()

router.get("/",getUsers)

router.get(
    "/search/:id",
    [
        check('id','ID inválido'),
        check("id").custom(existentUserById),
        validarCampos
    ],
    searchUser
)

router.put(
    "/update/:id",
    [
        validarJWT,
        check('id','ID inválido').isMongoId(),
        check('id').custom(existentUserById),
        validarCampos
    ],
    updateUser
)


export default router