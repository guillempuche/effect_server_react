// handlers.ts
import { Effect, Option, pipe } from 'effect'
import { RouterBuilder } from 'effect-http'

import { RepoAuthorLive } from '@journals/adapters/repositories'
import { api } from './api'

export const handlerAdd = RouterBuilder.handler(api, 'addAuthor', ({ body }) =>
	RepoAuthorLive(body),
)

export const handlerDelete = RouterBuilder.handler(
	api,
	'deleteAuthor',
	({ params }) =>
		RepoAuthor.get
			.deleteAuthor(params.id)
			.pipe(Effect.map(success => (success ? true : false))),
)

export const handlerGet = RouterBuilder.handler(api, 'getAuthor', ({ query }) =>
	RepoAuthor.get.getAuthor(query.id).pipe(
		Effect.flatMap(
			Option.match({
				onNone: () => Effect.fail(new Error('Author not found')),
				onSome: Effect.succeed,
			}),
		),
	),
)

export const handlerUpdate = RouterBuilder.handler(
	api,
	'updateAuthor',
	({ params, body }) => RepoAuthor.get.updateAuthor(params.id, body),
)
