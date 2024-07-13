import { DevTools } from '@effect/experimental'
import { NodeSdk } from '@effect/opentelemetry'
import { NodeRuntime } from '@effect/platform-node'
import {
	BatchSpanProcessor,
	ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-node'
import { Effect, Layer } from 'effect'
import { Middlewares, RouterBuilder } from 'effect-http'
import { NodeServer } from 'effect-http-node'

import {
	RepoAuthor,
	ServiceRepositories,
	ServiceSQL,
} from '@journals/adapters/repositories'
import { api } from './api.js'
import { ServiceLoggerDebug, appError } from './utils.js'

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

/**
 * OpenTelemetry service in console
 */
const ServiceOpenTelemetry = NodeSdk.layer(() => ({
	resource: { serviceName: 'journals' },
	spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
}))

// Run the server
app.pipe(
	Effect.tap(Effect.logInfo('Server docs at http://localhost:4000/docs#/')), // Tap is for side-effecting operations that do not change the value being passed through the chain
	Effect.flatMap(NodeServer.listen({ port: 4000 })),
	Effect.provide(
		Layer.mergeAll(ServiceRepositories, ServiceSQL, ServiceOpenTelemetry).pipe(
			Layer.provide(DevTools.layer()),
			Layer.provide(ServiceLoggerDebug),
		),
	),
	Effect.tapErrorCause(Effect.logError), // Tap andles errors by logging them without interrupting the chain of effects.
	NodeRuntime.runMain,
)
