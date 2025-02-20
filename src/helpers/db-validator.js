import Role from "../role/role.model.js"
import User from "../users/user.model.js"

export const isValidRol = async (rol="") => {
    const existentRol = await Role.findOne({rol})

    if (!existentRol) {
        throw new Error(`El rol ${rol} no existe`)
    }
}

export const existEmail = async (email='') => {
    const existentEmail = await User.findOne({email})

    if (existentEmail) {
        throw new Error(`El email ${email} ya existe`)
    }
}

export const existentUserById = async (id='') => {
    const userExist = await User.findById(id)

    if (!userExist) {
        throw new Error(`El ID ${id} no existe`)
    }
}