import { Effect, Layer } from 'effect'

import { RepoAuthor } from './author.repo.js'

const make = Effect.gen(function* () {
	yield* Effect.logInfo('Starting RepoServices')

	yield* Effect.acquireRelease(Effect.logInfo('RepoServices started'), () =>
		Effect.logInfo('RepoServices stopped'),
	)
}).pipe(Effect.annotateLogs({ module: 'sql-service' }))

export const ServiceRepositories = Layer.scopedDiscard(make).pipe(
	Layer.provide(RepoAuthor.Layer),
)
