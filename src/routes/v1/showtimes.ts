import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'

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

export default showTimesRouter;