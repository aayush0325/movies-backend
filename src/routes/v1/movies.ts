import { Hono } from "hono";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

const moviesRouter = new Hono();

moviesRouter.get('/',c => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
          message: 'You are not logged in.',
        })
    }
    return c.json({
        message: 'You are logged in!',
        userId: auth.userId,
    })
})

export default moviesRouter;