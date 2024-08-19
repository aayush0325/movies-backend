import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { createTheatre } from '../../zod/theatres';
import { drizzle } from 'drizzle-orm/d1';
import zod from 'zod'
import { theatres,seats,showtimes } from '../../db/schema';
import { like,eq,and } from 'drizzle-orm';

type Bindings = {
  DB: D1Database
}

const theatresRouter = new Hono<{Bindings:Bindings}>();

theatresRouter.get('/',c => {
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


theatresRouter.post('/create', async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in',
    });
  }
  const reqBody = await c.req.json();
  const { success, data } = createTheatre.safeParse(reqBody);
  if (!success) {
    return c.json({
      message: 'Invalid Inputs',
    });
  }
  const body: zod.infer<typeof createTheatre> = data;
  const db = drizzle(c.env.DB);

  try {
    const [theatreId] = await db
      .insert(theatres)
      .values({
        name:body.name,
        location:body.location,
        totalSeats:body.totalSeats,
        owner_id:auth.userId
      })
      .returning({ id: theatres.id });

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const seatsData = Array.from({ length: body.totalSeats }, (_, i) => {
      const letter = alphabet[Math.floor(i / 10)];
      const number = (i % 10) + 1;
      return {
        showtimeId: null,
        seatNumber: `${letter}${number}`,
        parentTheatre: theatreId.id,
        isBooked: 0,
        userId: null,
        owner_id: null,
      };
    });
    // Batch insertion to avoid SQLite variable limit
    const batchSize = 20; // Set a safe batch size to avoid hitting the limit
    for (let i = 0; i < seatsData.length; i += batchSize) {
      const batch = seatsData.slice(i, i + batchSize);
      await db.insert(seats).values(batch).run();
    }
    return c.json({
      message: `You have created a theatre with ${body.totalSeats} Seats`,
      theatreId: theatreId.id,
    });
  } catch (e) {
    return c.json({
      message: 'Failed to create theatre',
      error: (e as Error).message,
    }, 500); // Internal Server Error
  }
});

theatresRouter.get('/read/bulk',async (c) => {
  const filter = c.req.query('filter')?.trim() || '';
  if(filter===''){
    return c.json({
      message:'Invalid Search'
    })
  }
  const auth = getAuth(c);
  if(!auth?.userId){
    return c.json({
      message:'You are not logged in'
    })
  }
  
  try{
    const db = drizzle(c.env.DB);
    const result = await db.select().from(theatres).where(like(theatres.name,`%${filter}%`));
    const final = result.map((item) => {
      return {
        name:item.name,
        location:item.location,
        totalSeats:item.totalSeats,
        id:item.id
      }
    })
    return c.json({
      final
    })
  }catch(e){
    return c.json({
      message: 'Internal Server Error',
      error: (e as Error).message,
    }, 500);
  }

  
})

theatresRouter.get('/read/personal', async (c) => {
  const auth = getAuth(c);
  if(!auth?.userId){
    return c.json({
      message:'You are not logged in'
    })
  }
  try{
    const db = drizzle(c.env.DB);
    const result = await db.select().from(theatres).where(eq(theatres.owner_id,auth.userId));
    return c.json(result)
  }catch(e){
    return c.json({
      message: 'Internal Server Error',
      error: (e as Error).message,
    }, 500);
  }
})


theatresRouter.delete('/delete', async (c) => {
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
    const result = await db.delete(theatres).where(eq(theatres.id, id));

    if (result) {
      return c.json({
        message: 'Theatre deleted successfully',
        // result,
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
});




export default theatresRouter;