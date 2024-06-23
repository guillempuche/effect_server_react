import { Effect, Layer } from 'effect'
import { SqlAuthor } from './author.sql'

const make = Effect.gen(function* () {
	yield* Effect.logInfo('Starting SQLServices')

	yield* Effect.acquireRelease(Effect.logInfo('SQLServices started'), () =>
		Effect.logInfo('SQLServices stopped'),
	)
}).pipe(Effect.annotateLogs({ module: 'sql-service' }))

export const SQLServices = Layer.scopedDiscard(make).pipe(
	Layer.provide(SqlAuthor.Live),
)
