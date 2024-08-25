import { getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { showtimes,theatres,seats,seatBookings,users } from '../../db/schema';
import { createShowSchema,bookSeatSchema } from '../../zod/showtimes';
import { drizzle } from 'drizzle-orm/d1';
import { eq ,and} from 'drizzle-orm';

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


showTimesRouter.post('/booking', async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    });
  }

  const reqBody = await c.req.json();
  const { success, data } = bookSeatSchema.safeParse(reqBody);

  if (!success) {
    return c.json({
      message: "Invalid inputs",
    });
  }

  try {
    const db = drizzle(c.env.DB);

    const existingBooking = await db.select().from(seatBookings)
      .where(
        and(
          eq(seatBookings.seatId,data.seatId),
          eq(seatBookings.showtimeId,data.showtimeId),
          eq(seatBookings.isBooked,1)
        )
      );

    if (existingBooking.length) {
      return c.json({
        message: "Seat is already booked for this showtime",
      });
    }

  
    const showtime = await db.select().from(showtimes)
      .where(eq(showtimes.id,data.showtimeId));

    if (!showtime.length) {
      return c.json({
        message: "Showtime not found",
      });
    }
    
    const user = await db.select().from(users)
      .where(eq(users.id,auth.userId));

    if (!user.length) {
      return c.json({
        message: "User not found",
      });
    }

    if (user[0].balance < showtime[0].price) {
      return c.json({
        message: "Insufficient balance",
      });
    }

    const booking = await db.insert(seatBookings).values({
      seatId:data.seatId,
      showtimeId:data.showtimeId,
      userId:auth.userId,
      isBooked:1
    }).returning();

    await db.update(users).set({
      balance: user[0].balance - showtime[0].price
    }).where(eq(users.id,auth.userId))

    return c.json({
      message: "Seat booked successfully",
      booking,
      newBalance: user[0].balance - showtime[0].price,
    });


  } catch (e) {
    return c.json({
      message: 'Failed to book seat',
      error: (e as Error).message,
    }, 500);
  }
});

showTimesRouter.get('/seats/:showtimeId', async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    });
  }

  const showtimeId = parseInt(c.req.param('showtimeId'), 10);

  if (isNaN(showtimeId)) {
    return c.json({
      message: "Invalid showtime ID",
    });
  }

  try {
    const db = drizzle(c.env.DB);
    const theatreIdResult = await db
      .select()
      .from(showtimes)
      .where(eq(showtimes.id, showtimeId));

    if (!theatreIdResult.length) {
      return c.json({
        message: "Showtime not found",
      });
    }

    const theatreId = theatreIdResult[0].theatreId;
    const seatStatus = await db
      .select({
        seatId: seats.id,
        seatNumber: seats.seatNumber,
        isBooked: seatBookings.isBooked,
      })
      .from(seats)
      .leftJoin(
        seatBookings,
        and(
          eq(seatBookings.seatId, seats.id),
          eq(seatBookings.showtimeId, showtimeId)
        )
      )
      .where(eq(seats.parentTheatre, theatreId))
      .orderBy(seats.seatNumber);

    return c.json({
      message: `${seatStatus.length} Seats retrieved successfully`,
      seats: seatStatus,
    });

  } catch (e) {
    return c.json({
      message: 'Failed to retrieve seats',
      error: (e as Error).message,
    }, 500);
  }
});




export default showTimesRouter;