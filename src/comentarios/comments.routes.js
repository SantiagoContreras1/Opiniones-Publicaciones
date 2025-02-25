import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-JWT.js";

import { saveComent,updateComment,deleteComment } from "./comments.controller.js";

const router = Router()

router.post(
    "/save/",
    [
        validarJWT,
        check("text", "El texto es obligatorio,payaso").not().isEmpty(),
        validarCampos
    ],
    saveComent
)

router.put(
    "/update/:id",
    [
        validarJWT,
        check("text", "El texto es obligatorio,payaso").not().isEmpty(),
        validarCampos
    ],
    updateComment
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        check("id", "El id es obligatorio").isMongoId(),
        //check("id").custom(id => !id || ObjectId.isValid(id)),
        validarCampos
    ],
    deleteComment
)


export default router