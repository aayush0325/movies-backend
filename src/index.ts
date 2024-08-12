import { Hono } from 'hono'
import { logger } from 'hono/logger'
import v1 from './routes'
import { clerkMiddleware} from '@hono/clerk-auth'

const app = new Hono()

app.use(logger())
app.use('*', clerkMiddleware())

type Bindings = {
  D1: D1Database
}

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/v1',v1);

export default app
