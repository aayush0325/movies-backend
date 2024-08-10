import { Hono } from 'hono'

const app = new Hono()

type Bindings = {
  D1: D1Database
}

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
