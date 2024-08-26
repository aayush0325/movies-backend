import { getAuth } from '@hono/clerk-auth';
import { Hono } from 'hono';
import { createUser, updateUser } from '../../zod/users';
import { users, seatBookings, movies, theatres, showtimes, seats } from '../../db/schema';
import { drizzle } from 'drizzle-orm/d1';
import zod from 'zod';
import { eq } from 'drizzle-orm';

type Bindings = {
    DB: D1Database;
};

const userRouter = new Hono<{ Bindings: Bindings }>();

userRouter.get('/', (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in.',
        }, 401);
    }
    return c.json({
        message: 'You are logged in!',
    }, 200);
});

userRouter.post('/create', async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in',
        }, 401);
    }

    const reqBody = await c.req.json();
    const { success, data } = createUser.safeParse(reqBody);
    if (!success) {
        return c.json({
            message: 'Invalid Inputs',
        }, 400);
    }
    const body: zod.infer<typeof createUser> = data;

    const db = drizzle(c.env.DB);
    try {
        await db.insert(users).values({
            id: auth.userId,
            firstName: body.firstName,
            lastName: body.lastName,
        }).run();
        return c.json({
            message: 'User created successfully',
        }, 201);
    } catch (e) {
        return c.json({
            message: 'Failed to create user',
            error: (e as Error).message,
        }, 500);
    }
});

userRouter.get('/read', async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in',
        }, 401);
    }

    const db = drizzle(c.env.DB);
    try {
        const result = await db.select().from(users).where(eq(users.id, auth.userId));
        if (result.length === 0) {
            return c.json({
                message: 'User Not Found',
            }, 404);
        } else {
            return c.json({
                firstName: result[0].firstName,
                lastName: result[0].lastName,
                createdAt: result[0].createdAt,
                balance: result[0].balance,
            }, 200);
        }
    } catch (e) {
        return c.json({
            message: 'Failed to fetch user',
            error: (e as Error).message,
        }, 500);
    }
});

userRouter.delete('/delete', async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in',
        }, 401);
    }

    const db = drizzle(c.env.DB);
    try {
        const result = await db.delete(users).where(eq(users.id, auth.userId)).run();
        if (!result) {
            return c.json({
                message: 'User not found or already deleted',
            }, 404);
        } else {
            return c.json({
                message: 'User deleted successfully',
            }, 200);
        }
    } catch (e) {
        return c.json({
            message: 'Failed to delete user',
            error: (e as Error).message,
        }, 500);
    }
});

userRouter.put('/update', async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in',
        }, 401);
    }

    const reqBody = await c.req.json();
    const { success, data } = updateUser.safeParse(reqBody);
    if (!success) {
        return c.json({
            message: 'Invalid Inputs',
        }, 400);
    }
    const body: zod.infer<typeof updateUser> = data;

    const db = drizzle(c.env.DB);
    try {
        await db.update(users).set(body).where(eq(users.id, auth.userId)).run();
        return c.json({
            message: 'User updated successfully',
        }, 200);
    } catch (e) {
        return c.json({
            message: 'Failed to update user',
            error: (e as Error).message,
        }, 500);
    }
});

interface Booking {
    theatreName: string;
    movieName: string;
    seats: string[];
}

interface BookingResponse {
    bookings: Booking[];
}

userRouter.get('/bookings', async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in',
        }, 401);
    }

    try {
        const db = drizzle(c.env.DB);

        const result = await db
            .select({
                theatreName: theatres.name,
                movieName: movies.title,
                seatNumber: seats.seatNumber,
            })
            .from(seatBookings)
            .innerJoin(seats, eq(seatBookings.seatId, seats.id))
            .innerJoin(showtimes, eq(seatBookings.showtimeId, showtimes.id))
            .innerJoin(theatres, eq(showtimes.theatreId, theatres.id))
            .innerJoin(movies, eq(showtimes.movieId, movies.id))
            .where(eq(seatBookings.userId, auth.userId));

        // Type-safe grouping of bookings by theatre
        const groupedBookings = result.reduce<Record<string, Booking>>((acc, curr) => {
            const { theatreName, movieName, seatNumber } = curr;

            if (!acc[theatreName]) {
                acc[theatreName] = {
                    theatreName,
                    movieName,
                    seats: []
                };
            }

            acc[theatreName].seats.push(seatNumber);
            return acc;
        }, {});

        // Converting grouped bookings to an array
        const bookingsArray: Booking[] = Object.values(groupedBookings);

        const response: BookingResponse = { bookings: bookingsArray };

        return c.json(response, 200);
    } catch (e) {
        return c.json({
            message: 'Failed to fetch bookings',
            error: (e as Error).message,
        }, 500);
    }
});

export default userRouter;
