import zod from 'zod'


export const createShowSchema = zod.object({
    movieId:zod.number().int().positive(),
    theatreId:zod.number().int().positive(),
    startTime: zod.string(),
    endTime:zod.string(),
    price:zod.number(),
})


export const bookSeatSchema = zod.object({
    seatId:zod.number().int().positive(),
    showtimeId:zod.number().int().positive()
})