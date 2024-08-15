import userRouter from './v1/users'
import theatresRouter from './v1/theatres'
import moviesRouter from './v1/movies'
import showTimesRouter from './v1/showtimes'
import { Hono } from 'hono'

type Bindings = {
    DB: D1Database
}

const v1 = new Hono<{Bindings:Bindings}>();

v1.get('/',c => {
    return c.text('V1 API Working')
})

v1.route('/movies',moviesRouter)
v1.route('/users',userRouter)
v1.route('/theatres',theatresRouter)
v1.route('/shows',showTimesRouter)

export default v1;