import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'

const theatresRouter = new Hono();

theatresRouter.get('/',c => {
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

export default theatresRouter;