import zod from 'zod'


export const createShowSchema = zod.object({
    movieId:zod.number(),
    theatreId:zod.number(),
    startTime: zod.string(),
    endTime:zod.string(),
    price:zod.number(),
})