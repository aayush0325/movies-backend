import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}


const theatresRouter = new Hono<{Bindings:Bindings}>();

theatresRouter.get('/',c => {
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

export default theatresRouter;