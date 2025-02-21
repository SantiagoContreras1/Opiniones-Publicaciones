import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js"
import {validarJWT} from "../middlewares/validar-JWT.js"
import { getCategories,saveCategory,deleteCategory,updateCategory } from "./category.controller.js";

const router = Router()

router.get("/",getCategories)

router.post(
    "/save/",
    [
        validarJWT,
        check("name","El nombre es obligatorio").not().isEmpty(),
        check("description","La descripción es obligatoria").not().isEmpty(),
        validarCampos
    ],
    saveCategory
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        check("id","El id es obligatorio").not().isEmpty(),
        validarCampos
    ],
    deleteCategory
)

router.put(
    "/update/:id",
    [
        validarJWT,
        check("name","El nombre es obligatorio").not().isEmpty(),
        check("description","La descripción es obligatoria").not().isEmpty(),
        validarCampos
    ],
    updateCategory
)
export default router