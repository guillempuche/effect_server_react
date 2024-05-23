import { Author } from '@journals/core'
import { Hono } from 'hono'
import { Temporal } from 'temporal-polyfill'

// export type Bindings = {
//   SUPABASE_SERVICE_KEY: string;
//   SUPABASE_URL: string;
//   INVITE_REDIRECT_URL: string;
//   MASTER_TOKEN: string;
// };
// const app = new Hono<{ Bindings: Bindings }>();
// app.use('/api/invite/:role/:email', (c, next) =>
//   bearerAuth({ token: c.env.MASTER_TOKEN })(c, next)
// );
const app = new Hono()

app.get('/', c => {
	return c.text('Hello Hono!')
})

// A route to create a new author
app.post('/authors', async c => {
	// Parse the request body to get the author details
	const { id, version, created_by_id, created_at, fullname } =
		await c.req.json()

	// Create a new Author instance
	const author = new Author({
		id,
		version,
		created_by_id,
		created_at,
		fullname,
	})

	// Return the created author as JSON
	return c.json(author)
})

// A route to fetch an author by ID
app.get('/authors/:id', c => {
	// Here you would normally fetch the author from a database
	// For this example, we'll return a dummy author
	const author = new Author({
		id: c.req.param('id'),
		version: '1.0.0',
		created_by_id: 'dummy-user-id',
		created_at: Temporal.Now.zonedDateTimeISO(),
		fullname: 'John Doe',
	})

	// Return the fetched author as JSON
	return c.json(author)
})

export default app
