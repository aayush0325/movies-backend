import { Hono } from "hono";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { createMovieSchema } from "../../zod/movies";
import { drizzle } from "drizzle-orm/d1";
import { movies } from "../../db/schema";
import { eq, like } from "drizzle-orm";
import { title } from "process";

type Bindings = {
    DB: D1Database
}

const moviesRouter = new Hono<{Bindings:Bindings}>();

moviesRouter.get('/',c => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in.',
        })
    }
    return c.json({
        message: 'You are logged in!',
    })
})


moviesRouter.post('/create',async (c) => {

    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in.',
        })
    }

    const reqBody = await c.req.json();
    const{success,data} = createMovieSchema.safeParse(reqBody)
    
    if(!success){
        return c.json({
            message:"Invalid inputs"
        })
    }

    try{
        const db = drizzle(c.env.DB);
        const result = await db.insert(movies).values({
            title: data.title,
            description: data.description,
            durationMinutes: data.durationMinutes,
            releaseDate: data.releaseDate,
            posterUrl: data.posterUrl,
            director:auth.userId
        }).returning()

        return c.json({
            message:"Movie Created",
            title:result[0].title,
            description:result[0].description,
            durationMinutes:result[0].durationMinutes,
            releaseDate:result[0].releaseDate,
            posterUrl:result[0].posterUrl
        })
    }catch(e){
        return c.json({
            message: 'Failed to create theatre',
            error: (e as Error).message,
        }, 500);
    }
})


moviesRouter.get('/read/personal',async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in.',
        })
    }

    try{
        const db = drizzle(c.env.DB);
        const result = await db.select().from(movies).where(eq(movies.director,auth.userId))

        return c.json({
            result
        })
    }catch(e){
        return c.json({
            message: 'Failed to create theatre',
            error: (e as Error).message,
        }, 500);
    }
})

moviesRouter.get('/read/bulk',async (c) => {
    const filter = c.req.query('filter')?.trim() || '';
    if(filter===''){
        return c.json({
        message:'Invalid Search'
        })
    }

    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in.',
        })
    }

    try{
        const db = drizzle(c.env.DB);
        const result = await db.select().from(movies).where(like(movies.title,`%${filter}%`))

        return c.json({
            result
        })
    }catch(e){
        return c.json({
            message: 'Failed to create theatre',
            error: (e as Error).message,
        }, 500);
    }
})

moviesRouter.get('/read/display',async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in.',
        })
    }

    try{
        const db = drizzle(c.env.DB);
        const result = await db.select().from(movies).limit(10)

        return c.json({
            result
        })
    }catch(e){
        return c.json({
            message: 'Failed to create theatre',
            error: (e as Error).message,
        }, 500);
    }
})


moviesRouter.delete('/delete',async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
        message: 'You are not logged in',
        }, 401);
    }

    const id = Number(c.req.query('id'));

    if (!id || isNaN(id)) {
        return c.json({
        message: 'Invalid theatre ID provided',
        }, 400);
    }

    try {
        const db = drizzle(c.env.DB);

        // Delete the theatre
        const result = await db.delete(movies).where(eq(movies.id, id));

        if (result) {
            return c.json({
                message: 'Theatre deleted successfully',
            });
        } else {
            return c.json({
                message: 'No theatre found for the given ID',
            }, 404);
        }
    } catch (e) {
        return c.json({
        message: 'Internal Server Error',
        error: (e as Error).message,
        }, 500);
    }
})




export default moviesRouter;