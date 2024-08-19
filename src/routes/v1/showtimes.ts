import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { showtimes } from '../../db/schema';

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

showTimesRouter.post('/create',async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    })
  }
})

export default showTimesRouter;