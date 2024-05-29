import { DevTools } from '@effect/experimental'
import { NodeRuntime } from '@effect/platform-node'
import { Effect, Layer } from 'effect'
import { Middlewares, RouterBuilder } from 'effect-http'
import { NodeServer } from 'effect-http-node'

import { RepoAuthor, SqlLive } from '@journals/adapters/repositories'
import { api } from './api'
import { appError, loggerDebug } from './utils'

export const app = Effect.gen(function* () {
	const repoAuthor = yield* RepoAuthor

	return RouterBuilder.make(api).pipe(
		RouterBuilder.handle('addAuthor', ({ body }) =>
			Effect.gen(function* () {
				return yield* repoAuthor.addAuthor(body)
			}).pipe(Effect.withSpan('addAuthor'), appError('could not add author')),
		),
		RouterBuilder.handle('deleteAuthor', ({ body }) =>
			Effect.gen(function* () {
				return yield* repoAuthor.deleteAuthor(body)
			}).pipe(
				Effect.withSpan('deleteAuthor'),
				appError('could not delete author'),
			),
		),
		RouterBuilder.handle('getAuthor', ({ query }) =>
			Effect.gen(function* () {
				return yield* repoAuthor.getAuthor(query)
			}).pipe(Effect.withSpan('getAuthor'), appError('could not get author')),
		),
		RouterBuilder.handle('updateAuthor', ({ body, path }) =>
			Effect.gen(function* () {
				return yield* repoAuthor.updateAuthor(path.authorId, body)
			}).pipe(
				Effect.withSpan('updateAuthor'),
				appError('could not update author'),
			),
		),
		RouterBuilder.build,
		Middlewares.errorLog,
	)
})

const program = app.pipe(
	Effect.tap(Effect.logInfo('Server docs at http://localhost:4000/docs#/')),
	// Effect.flatMap(NodeServer.listen({ port: 4000 })),
	Effect.provide(SqlLive.pipe(Layer.provide(DevTools.layer()))),
	Effect.provide(RepoAuthor.live),
	NodeServer.listen({ port: 4000 }),
	Effect.tapErrorCause(Effect.logError),
	Effect.provide(loggerDebug),
	// NodeRuntime.runMain,
)

NodeRuntime.runMain(program)
