import { Schema } from '@effect/schema'
import { Effect, FiberSet, Layer, Option } from 'effect'

import { RepoAuthor } from '@journals/adapters/repositories'
import { AuthorCreateParams, AuthorUpdateParams } from '@journals/usecases'
import { Express } from './express_server'

// Add author
export const LiveRouteAuthorAddAuthor = Layer.scopedDiscard(
	Effect.gen(function* () {
		const app = yield* Express
		const runFork = yield* FiberSet.makeRuntime<RepoAuthor>()

		app.post('/authors', (req, res) => {
			const decodeBody = Schema.decodeUnknown(AuthorCreateParams)
			const program = RepoAuthor.pipe(
				Effect.flatMap(repo =>
					decodeBody(req.body).pipe(
						Effect.matchEffect({
							onFailure: () =>
								Effect.sync(() => res.status(400).json('Invalid author')),
							onSuccess: author =>
								repo
									.addAuthor(author)
									.pipe(
										Effect.flatMap(author =>
											Effect.sync(() => res.json(author)),
										),
									),
						}),
					),
				),
				Effect.asVoid,
			)

			runFork(program)
		})
	}),
)

export const LiveRouteAuthorDeleteAuthor = Layer.scopedDiscard(
	Effect.gen(function* (_) {
		const app = yield* Express
		const runFork = yield* FiberSet.makeRuntime<RepoAuthor>()

		app.delete('/authors/:id', (req, res) => {
			const id = req.params.id
			const program = RepoAuthor.pipe(
				Effect.flatMap(repo => repo.deleteAuthor(id)),
				Effect.asVoid,
			)

			runFork(program)
		})
	}),
)

// Get author
export const LiveRouteAuthorGetAuthor = Layer.scopedDiscard(
	Effect.gen(function* () {
		const app = yield* Express
		const runFork = yield* FiberSet.makeRuntime<RepoAuthor>()

		app.get('/authors/:id', (req, res) => {
			const id = req.params.id
			const program = RepoAuthor.pipe(
				Effect.flatMap(repo => repo.getAuthor(id)),
				Effect.flatMap(
					Option.match({
						onNone: () =>
							Effect.succeed(
								res.status(404).json(`Author with id ${id} not found`),
							),
						onSome: author => Effect.sync(() => res.json(author)),
					}),
				),
				Effect.asVoid,
			)

			runFork(program)
		})
	}),
)

// Update author
export const LiveRouteAuthorUpdateAuthor = Layer.scopedDiscard(
	Effect.gen(function* () {
		const app = yield* Express
		const runFork = yield* FiberSet.makeRuntime<RepoAuthor>()

		app.put('/authors/:id', (req, res) => {
			const id = req.params.id
			const decodeBody = Schema.decodeUnknown(AuthorUpdateParams)
			const program = RepoAuthor.pipe(
				Effect.flatMap(repo =>
					decodeBody(req.body).pipe(
						Effect.matchEffect({
							onFailure: () =>
								Effect.sync(() => res.status(400).json('Invalid author')),
							onSuccess: author =>
								repo.updateAuthor(id, author).pipe(
									Effect.matchEffect({
										onFailure: () =>
											Effect.sync(() =>
												res.status(404).json(`Author with id ${id} not found`),
											),
										onSuccess: author => Effect.sync(() => res.json(author)),
									}),
								),
						}),
					),
				),
				Effect.asVoid,
			)

			runFork(program)
		})
	}),
)
