import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-JWT.js";

import { saveComent } from "./comments.controller.js";

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




export default router