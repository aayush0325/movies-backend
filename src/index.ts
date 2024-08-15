import { Hono } from 'hono'
import { logger } from 'hono/logger'
import v1 from './routes'
import { clerkMiddleware} from '@hono/clerk-auth'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{Bindings:Bindings}>()

app.use(logger())
app.use('*', clerkMiddleware())
app.use('api/v1/*',cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/v1',v1);

export default app
