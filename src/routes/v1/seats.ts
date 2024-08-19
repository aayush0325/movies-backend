import { getAuth } from '@hono/clerk-auth';
import { Hono } from 'hono';
import { createUser, updateUser } from '../../zod/users';
import { users } from '../../db/schema';
import { drizzle } from 'drizzle-orm/d1';
import zod from 'zod';
import { eq } from 'drizzle-orm';

type Bindings = {
    DB: D1Database;
};

const seatsRouter = new Hono<{Bindings:Bindings}>();

seatsRouter.get('/',(c) => {
    return c.json({
        message:"Seats router working"
    })
})


export default seatsRouter;