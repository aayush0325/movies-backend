import { getAuth } from '@hono/clerk-auth';
import { Hono } from 'hono';
import { seats, users, showtimes } from '../../db/schema';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';

type Bindings = {
    DB: D1Database;
};

const seatsRouter = new Hono<{Bindings:Bindings}>();

seatsRouter.get('/', (c) => {
    return c.json({
        message: "Seats router working"
    }, 200); // OK
});

seatsRouter.get('/read/from', async (c) => {
    const id = Number(c.req.query('id'));

    if (!id || isNaN(id)) {
        return c.json({
            message: 'Invalid theatre ID provided',
        }, 400); // Bad Request
    };

    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in',
        }, 401); // Unauthorized
    };

    try {
        const db = drizzle(c.env.DB);
        const result = await db.select().from(seats).where(eq(seats.parentTheatre, id));
        if (result.length) {
            return c.json({
                message: `There are ${result.length} seats in this theatre`,
                result,
            }, 200); // OK
        } else {
            return c.json({
                message: 'No theatre found for the given ID',
            }, 404); // Not Found
        }
    } catch (e) {
        return c.json({
            message: 'Internal Server Error',
            error: (e as Error).message,
        }, 500); // Internal Server Error
    };
});

export default seatsRouter;
