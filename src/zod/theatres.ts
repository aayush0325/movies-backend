import zod from 'zod'

export const createTheatre = zod.object({
    name:zod.string().min(3),
    location: zod.string().min(3),
    totalSeats:zod.number().min(25).max(150),
})