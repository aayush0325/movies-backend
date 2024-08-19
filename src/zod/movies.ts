import zod from 'zod'

export const createMovieSchema = zod.object({
    title:zod.string().min(1),
    description:zod.string().min(5),
    durationMinutes:zod.number().min(5),
    releaseDate:zod.string(),
    posterUrl:zod.string().optional(),
})
