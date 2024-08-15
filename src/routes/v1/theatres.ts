import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { createTheatre } from '../../zod/theatres';
import { drizzle } from 'drizzle-orm/d1';
import zod from 'zod'
import { theatres,seats } from '../../db/schema';

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
      .values(body)
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
        owner_id: auth.userId,
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



export default theatresRouter;