import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-JWT.js";
import { postPublication,updatePublication,getPublications,deletePublication } from "./publication.controller.js"

const router = Router();

router.get("/",getPublications)

router.post(
    "/publication",
    [
        validarJWT,
        check("title", "El título es obligatorio").not().isEmpty(),
        check("text", "El cuerpo de tu publicación es obligatorio, bocotas.").not().isEmpty(),
        validarCampos
    ],
    postPublication
)

router.put(
    "/update/:id",
    [
        validarJWT,
        check("id", "ID no valido. Payaso.").not().isEmpty(),
        validarCampos
    ],
    updatePublication
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        check("id", "ID no valido. Payaso.").not().isEmpty(),
        validarCampos
    ],
    deletePublication
)
export default router