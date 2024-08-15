import { Hono } from "hono";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

type Bindings = {
    DB: D1Database
}

const moviesRouter = new Hono<{Bindings:Bindings}>();

moviesRouter.get('/',c => {
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

export default moviesRouter;