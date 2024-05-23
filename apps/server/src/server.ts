import bodyParser from 'body-parser'
import { Context, Effect, Layer, Runtime } from 'effect'
import express from 'express'

export const LiveServer = Layer.scopedDiscard(
	Effect.gen(function* (_) {
		const port = 4000
		const app = yield* Express
		const runtime = yield* Effect.runtime<never>()
		const runFork = Runtime.runFork(runtime)

		yield* Effect.acquireRelease(
			Effect.sync(() =>
				app.listen(port, () => {
					runFork(Effect.log(`Server running on port ${port}`))
				}),
			),
			server => Effect.sync(() => server.close()),
		)
	}),
)

export class Express extends Context.Tag('@server/Express')<
	Express,
	ReturnType<typeof express>
>() {
	static readonly Live = Layer.sync(Express, () => {
		const app = express()

		app.use(bodyParser.json())

		return app
	})
}
