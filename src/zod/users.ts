//Used for body validation

import zod from 'zod'

export const createUser = zod.object({
    firstName:zod.string().min(3),
    lastName: zod.string().min(3),
})

export const updateUser = zod.object({
    firstName:zod.string().min(3).optional(),
    lastName:zod.string().min(3).optional(),
    balance:zod.number().min(5000).optional(),
})