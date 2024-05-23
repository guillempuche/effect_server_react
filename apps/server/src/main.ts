import { DevTools } from '@effect/experimental'
import { NodeRuntime } from '@effect/platform-node'
import { Effect, Layer } from 'effect'
import { RouterBuilder } from 'effect-http'
import { NodeServer } from 'effect-http-node'

import { RepoAuthorLive, SqlLive } from '@journals/adapters/repositories'
import { api } from './api'
import { AuthorHandlerAdd, AuthorHandlerGet } from './handlers'

export const app = RouterBuilder.make(api).pipe(
	RouterBuilder.handle(AuthorHandlerAdd),
	RouterBuilder.handle(AuthorHandlerDelete),
	RouterBuilder.handle(AuthorHandlerGet),
	RouterBuilder.handle(AuthorHandlerAdd),
	RouterBuilder.build,
)

app.pipe(
	NodeServer.listen({ port: 4000 }),
	Effect.provide(SqlLive.pipe(Layer.provide(DevTools.layer()))),
	Effect.tapErrorCause(Effect.logError),
	RepoAuthorLive,
	NodeRuntime.runMain,
)
