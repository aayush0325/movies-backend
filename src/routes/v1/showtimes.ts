import { getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { showtimes,theatres,seats } from '../../db/schema';
import { createShowSchema } from '../../zod/showtimes';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';

type Bindings = {
  DB: D1Database
}

const showTimesRouter = new Hono<{Bindings:Bindings}>();

showTimesRouter.get('/',c => {
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

showTimesRouter.post('/create',async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    })
  }

  const reqBody = await c.req.json();
  const{success,data} = createShowSchema.safeParse(reqBody)
  
  if(!success){
    return c.json({
        message:"Invalid inputs"
    })
  }

  try{
    const db = drizzle(c.env.DB);

    const result = await db.insert(showtimes).values({
      theatreId:data.theatreId,
      movieId:data.movieId,
      startTime:data.startTime,
      endTime:data.endTime,
      price:data.price,
      owner_id:auth.userId
    }).returning()

    return c.json({
      message:"Show Created",
      result
    })
  }catch(e){
    return c.json({
      message: 'Failed to create theatre',
      error: (e as Error).message,
    }, 500);
  }
})

showTimesRouter.get('/read/personal',async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    })
  }

  try{

    const db = drizzle(c.env.DB);

    const result = await db.select().from(showtimes).where(eq(showtimes.owner_id,auth.userId));

    return c.json(result)

  }catch(e){
    return c.json({
      message: 'Failed to create theatre',
      error: (e as Error).message,
    }, 500);
  }
})

showTimesRouter.get('/read/theatre',async (c) => {
  const id = Number(c.req.query('id'));
  if (!id || isNaN(id)) {
      return c.json({
      message: 'Invalid theatre ID provided',
      }, 400);
  }

  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    })
  }

  try{
    
    const db = drizzle(c.env.DB);

    const result = await db.select().from(showtimes).where(eq(showtimes.theatreId,id));

    return c.json(result)

  }catch(e){
    return c.json({
      message: 'Failed to create theatre',
      error: (e as Error).message,
    }, 500);
  }
})

showTimesRouter.delete('/delete/byUSER',async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    })
  }

  try{
    
    const db = drizzle(c.env.DB);

    const result = await db.delete(showtimes).where(eq(showtimes.owner_id,auth.userId));

    if (result) {
      return c.json({
        message: 'Theatre deleted successfully',
      });
  } else {
      return c.json({
        message: 'No theatre found for the given ID',
      }, 404);
  }

  }catch(e){
    return c.json({
      message: 'Failed to create theatre',
      error: (e as Error).message,
    }, 500);
  }
})

showTimesRouter.delete('/delete/byID',async (c) => {
  const id = Number(c.req.query('id'));
  if (!id || isNaN(id)) {
      return c.json({
      message: 'Invalid theatre ID provided',
      }, 400);
  }

  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    })
  }

  try{
    
    const db = drizzle(c.env.DB);

    const result = await db.delete(showtimes).where(eq(showtimes.id,id));

    if (result) {
      return c.json({
          message: 'Theatre deleted successfully',
      });
  } else {
      return c.json({
          message: 'No theatre found for the given ID',
      }, 404);
  }

  }catch(e){
    return c.json({
      message: 'Failed to create theatre',
      error: (e as Error).message,
    }, 500);
  }
})

export default showTimesRouter;