import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'

const showTimesRouter = new Hono();

showTimesRouter.get('/',c => {
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

export default showTimesRouter;