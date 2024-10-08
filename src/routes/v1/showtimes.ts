import { getAuth } from '@hono/clerk-auth';
import { Hono } from 'hono';
import { showtimes, theatres, seats, seatBookings, users,movies } from '../../db/schema';
import { createShowSchema, bookSeatSchema } from '../../zod/showtimes';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, or,like } from 'drizzle-orm';

type Bindings = {
  DB: D1Database
}

const showTimesRouter = new Hono<{ Bindings: Bindings }>();

showTimesRouter.get('/', (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({
        message: 'You are not logged in.',
      }, 401); // Unauthorized
    }
    return c.json({
        message: 'You are logged in!',
    }, 200); // OK
});

showTimesRouter.post('/create', async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    }, 401); // Unauthorized
  }

  const reqBody = await c.req.json();
  const { success, data } = createShowSchema.safeParse(reqBody);
  
  if (!success) {
    return c.json({
        message: "Invalid inputs"
    }, 400); // Bad Request
  }

  try {
    const db = drizzle(c.env.DB);

    const result = await db.insert(showtimes).values({
      theatreId: data.theatreId,
      movieId: data.movieId,
      startTime: data.startTime,
      endTime: data.endTime,
      price: data.price,
      owner_id: auth.userId
    }).returning();

    return c.json({
      message: "Show Created",
      result
    }, 201); // Created
  } catch (e) {
    return c.json({
      message: 'Failed to create show',
      error: (e as Error).message,
    }, 500); // Internal Server Error
  }
});

showTimesRouter.get('/read/search', async (c) => {
  // Extract and validate the filter term from query parameters
  const filter = c.req.query('filter')?.trim();
  if (!filter) {
    return c.json(
      { message: 'Invalid Search: Filter term is required.' },
      400 // Bad Request
    );
  }

  // Optional: If you want to require authentication for searching showtimes
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json(
      { message: 'You are not logged in.' },
      401 // Unauthorized
    );
  }

  try {
    const db = drizzle(c.env.DB);

    // Perform the search by filtering on multiple fields
    const result = await db
      .select({
        showtimeId: showtimes.id,
        startTime: showtimes.startTime,
        endTime: showtimes.endTime,
        price: showtimes.price,
        movieTitle: movies.title,
        posterUrl: movies.posterUrl,
        theatreName: theatres.name,
        description: movies.description,
      })
      .from(showtimes)
      .innerJoin(movies, eq(showtimes.movieId, movies.id))
      .innerJoin(theatres, eq(showtimes.theatreId, theatres.id))
      .where(
        or(
          like(movies.title, `%${filter}%`),
          like(theatres.name, `%${filter}%`),
          like(movies.description, `%${filter}%`)
        )
      )
      .orderBy(showtimes.startTime) // Order by the earliest shows first
      .limit(10); // You can adjust the limit as needed

    // Optionally, map the results to a desired format
    const final = result.map((item) => ({
      showtimeId: item.showtimeId,
      startTime: item.startTime,
      endTime: item.endTime,
      price: item.price,
      movieTitle: item.movieTitle,
      posterUrl: item.posterUrl,
      theatreName: item.theatreName,
      description: item.description,
    }));

    return c.json({ results: final }, 200); // OK
  } catch (e) {
    console.error('Error fetching search results:', e);
    return c.json(
      {
        message: 'Failed to fetch search results.',
        error: (e as Error).message,
      },
      500 // Internal Server Error
    );
  }
});

showTimesRouter.get('/read/home', async (c) => {
  const limit = Number(c.req.query('limit')) || 10; // Default limit to 10 shows if not provided

  try {
    const db = drizzle(c.env.DB);

    const result = await db.select({
      showtimeId: showtimes.id,
      startTime: showtimes.startTime,
      endTime: showtimes.endTime,
      price: showtimes.price,
      movieTitle: movies.title,
      posterUrl: movies.posterUrl,
      theatreName: theatres.name,
      description: movies.description
    })
    .from(showtimes)
    .innerJoin(movies, eq(showtimes.movieId, movies.id))
    .innerJoin(theatres, eq(showtimes.theatreId, theatres.id))
    .orderBy(showtimes.startTime) // Order by the earliest shows first
    .limit(limit); // Limit the number of results

    return c.json(result, 200); // OK

  } catch (e) {
    return c.json({
      message: 'Failed to fetch shows for home page',
      error: (e as Error).message,
    }, 500); // Internal Server Error
  }
});

showTimesRouter.get('/read/personal', async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    }, 401); // Unauthorized
  }

  try {
    const db = drizzle(c.env.DB);

    const result = await db.select({
      showtimeId: showtimes.id,
      startTime: showtimes.startTime,
      endTime: showtimes.endTime,
      price: showtimes.price,
      movieTitle: movies.title,
      posterUrl: movies.posterUrl, // Include posterUrl
      theatreName: theatres.name,
      description:movies.description
    })
    .from(showtimes)
    .innerJoin(movies, eq(showtimes.movieId, movies.id))
    .innerJoin(theatres, eq(showtimes.theatreId, theatres.id))
    .where(eq(showtimes.owner_id, auth.userId));

    return c.json(result, 200); // OK

  } catch (e) {
    return c.json({
      message: 'Failed to fetch personal showtimes',
      error: (e as Error).message,
    }, 500); // Internal Server Error
  }
});

showTimesRouter.get('/read/theatre', async (c) => {
  const id = Number(c.req.query('id'));
  if (!id || isNaN(id)) {
    return c.json({
      message: 'Invalid theatre ID provided',
    }, 400); // Bad Request
  }

  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    }, 401); // Unauthorized
  }

  try {
    const db = drizzle(c.env.DB);

    const result = await db.select({
      showtimeId: showtimes.id,
      startTime: showtimes.startTime,
      endTime: showtimes.endTime,
      price: showtimes.price,
      movieTitle: movies.title,
      posterUrl: movies.posterUrl, // Include posterUrl
      theatreName: theatres.name,
      description:movies.description
    })
    .from(showtimes)
    .innerJoin(movies, eq(showtimes.movieId, movies.id))
    .innerJoin(theatres, eq(showtimes.theatreId, theatres.id))
    .where(eq(showtimes.theatreId, id));

    return c.json(result, 200); // OK

  } catch (e) {
    return c.json({
      message: 'Failed to fetch showtimes for theatre',
      error: (e as Error).message,
    }, 500); // Internal Server Error
  }
});

showTimesRouter.delete('/delete/byUSER', async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    }, 401); // Unauthorized
  }

  try {
    const db = drizzle(c.env.DB);

    const result = await db.delete(showtimes).where(eq(showtimes.owner_id, auth.userId));

    if (result) {
      return c.json({
        message: 'Showtimes deleted successfully',
      }, 200); // OK
    } else {
      return c.json({
        message: 'No showtimes found for the given ID',
      }, 404); // Not Found
    }

  } catch (e) {
    return c.json({
      message: 'Failed to delete showtimes',
      error: (e as Error).message,
    }, 500); // Internal Server Error
  }
});

showTimesRouter.delete('/delete/byUSER', async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    }, 401); // Unauthorized
  }

  try {
    const db = drizzle(c.env.DB);

    const result = await db.delete(showtimes).where(eq(showtimes.owner_id, auth.userId));

    if (result) {
      return c.json({
        message: 'Showtimes deleted successfully',
      }, 200); // OK
    } else {
      return c.json({
        message: 'No showtimes found for the given ID',
      }, 404); // Not Found
    }

  } catch (e) {
    return c.json({
      message: 'Failed to delete showtimes',
      error: (e as Error).message,
    }, 500); // Internal Server Error
  }
});

showTimesRouter.delete('/delete/byID', async (c) => {
  const id = Number(c.req.query('id'));
  if (!id || isNaN(id)) {
    return c.json({
      message: 'Invalid showtime ID provided',
    }, 400); // Bad Request
  }

  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    }, 401); // Unauthorized
  }

  try {
    const db = drizzle(c.env.DB);

    const result = await db.delete(showtimes).where(eq(showtimes.id, id));

    if (result) {
      return c.json({
        message: 'Showtime deleted successfully',
      }, 200); // OK
    } else {
      return c.json({
        message: 'No showtime found for the given ID',
      }, 404); // Not Found
    }

  } catch (e) {
    return c.json({
      message: 'Failed to delete showtime',
      error: (e as Error).message,
    }, 500); // Internal Server Error
  }
});

showTimesRouter.post('/booking', async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    }, 401); // Unauthorized
  }

  const reqBody = await c.req.json();
  const { success, data } = bookSeatSchema.safeParse(reqBody);

  if (!success) {
    return c.json({
      message: "Invalid inputs",
    }, 400); // Bad Request
  }

  try {
    const db = drizzle(c.env.DB);

    // Build the OR condition for checking each seatId
    const seatConditions = data.seatIds.map(seatId =>
      and(
        eq(seatBookings.showtimeId, data.showtimeId),
        eq(seatBookings.seatId, seatId),
        eq(seatBookings.isBooked, 1)
      )
    );

    const existingBookings = await db.select().from(seatBookings)
      .where(or(...seatConditions));

    if (existingBookings.length) {
      return c.json({
        message: "One or more seats are already booked for this showtime",
        bookedSeats: existingBookings.map(booking => booking.seatId),
      }, 409); // Conflict
    }

    const showtime = await db.select().from(showtimes)
      .where(eq(showtimes.id, data.showtimeId));

    if (!showtime.length) {
      return c.json({
        message: "Showtime not found",
      }, 404); // Not Found
    }

    const user = await db.select().from(users)
      .where(eq(users.id, auth.userId));

    if (!user.length) {
      return c.json({
        message: "User not found",
      }, 404); // Not Found
    }

    const totalCost = showtime[0].price * data.seatIds.length;

    if (user[0].balance < totalCost) {
      return c.json({
        message: "Insufficient balance",
        requiredBalance: totalCost,
      }, 402); // Payment Required
    }

    const bookings = await db.insert(seatBookings).values(
      data.seatIds.map(seatId => ({
        seatId,
        showtimeId: data.showtimeId,
        userId: auth.userId,
        isBooked: 1
      }))
    ).returning();

    await db.update(users).set({
      balance: user[0].balance - totalCost
    }).where(eq(users.id, auth.userId));

    return c.json({
      message: "Seats booked successfully",
      bookings,
      newBalance: user[0].balance - totalCost,
    }, 201); // Created

  } catch (e) {
    return c.json({
      message: 'Failed to book seats',
      error: (e as Error).message,
    }, 500); // Internal Server Error
  }
});

showTimesRouter.get('/seats/:showtimeId', async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    }, 401); // Unauthorized
  }

  const showtimeId = parseInt(c.req.param('showtimeId'), 10);

  if (isNaN(showtimeId)) {
    return c.json({
      message: "Invalid showtime ID",
    }, 400); // Bad Request
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
      }, 404); // Not Found
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
    }, 200); // OK

  } catch (e) {
    return c.json({
      message: 'Failed to retrieve seats',
      error: (e as Error).message,
    }, 500); // Internal Server Error
  }
});

export default showTimesRouter;
