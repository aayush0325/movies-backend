import { getAuth } from '@hono/clerk-auth';
import { Hono } from 'hono';
import { createUser,updateUser } from '../../zod/users';
import { users } from '../../db/schema';
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
        }, 401); // Unauthorized
    }
    return c.json({
        message: 'You are logged in!',
    }, 200); // OK
});

userRouter.post('/create', async (c) => {
    // auth cookie check
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in',
        }, 401); // Unauthorized
    }

    // input validation
    const { success, data } = createUser.safeParse(c.body);
    if (!success) {
        return c.json({
            message: 'Invalid Inputs',
        }, 400); // Bad Request
    }
    const body: zod.infer<typeof createUser> = data;

    // db query
    const db = drizzle(c.env.DB);
    try {
        await db.insert(users).values({
            id: auth.userId,
            firstName: body.firstName,
            lastName: body.lastName,
        }).run();
        return c.json({
            message: 'User created successfully',
        }, 201); // Created
    } catch (e) {
        return c.json({
            message: 'Failed to create user',
            error: (e as Error).message,
        }, 500); // Internal Server Error
    }
});

userRouter.get('/read', async (c) => {
    // auth cookie check
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in',
        }, 401); // Unauthorized
    }
    // db query
    const db = drizzle(c.env.DB);
    try {
        const result = await db.select().from(users).where(eq(users.id, auth.userId));
        if (!result) {
            return c.json({
                message: 'User Not Found',
            }, 404); // Not Found
        } else {
            return c.json({ //  DO NOT SEND BACK USERID!!!!!!!
                firstName: result[0].firstName,
                lastName: result[0].lastName,
                createdAt: result[0].createdAt,
                balance: result[0].balance,
            }, 200); // OK
        }
    } catch (e) {
        return c.json({
            message: 'Failed to fetch user',
            error: (e as Error).message,
        }, 500); // Internal Server Error
    }
});

userRouter.delete('/delete', async (c) => {
    // auth cookie check
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in',
        }, 401); // Unauthorized
    }

    // db query
    const db = drizzle(c.env.DB);
    try {
        const result = await db.delete(users).where(eq(users.id, auth.userId)).run();
        if (!result) {
            return c.json({
                message: 'User not found or already deleted',
            }, 404); // Not Found
        } else {
            return c.json({
                message: 'User deleted successfully',
            }, 200); // OK
        }
    } catch (e) {
        return c.json({
            message: 'Failed to delete user',
            error: (e as Error).message,
        }, 500); // Internal Server Error
    }
});

userRouter.put('/update', async (c) => {
    // auth cookie check
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            message: 'You are not logged in',
        }, 401); // Unauthorized
    }

    // input validation
    const { success, data } = updateUser.safeParse(c.body);
    if (!success) {
        return c.json({
            message: 'Invalid Inputs',
        }, 400); // Bad Request
    }
    const body: zod.infer<typeof updateUser> = data;

    // db query
    const db = drizzle(c.env.DB);
    try {
        await db.update(users).set(body).where(eq(users.id,auth.userId)).run();
        return c.json({
            message: 'User updated successfully',
        }, 201); // Created
    } catch (e) {
        return c.json({
            message: 'Failed to update user',
            error: (e as Error).message,
        }, 500); // Internal Server Error
    }
});

export default userRouter;
