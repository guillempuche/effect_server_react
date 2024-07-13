import { Effect, Layer } from 'effect'
import { SqlAuthor } from './author.sql.js'

const make = Effect.gen(function* () {
	yield* Effect.logInfo('Starting ServiceSQL')

	yield* Effect.acquireRelease(Effect.logInfo('ServiceSQL started'), () =>
		Effect.logInfo('ServiceSQL stopped'),
	)
}).pipe(Effect.annotateLogs({ module: 'sql-service' }))

export const ServiceSQL = Layer.scopedDiscard(make).pipe(
	Layer.provide(SqlAuthor.Layer),
)
