import { Cause, Context, Effect, Layer, Option, pipe } from 'effect'
import { Temporal } from 'temporal-polyfill'

import { Author, AuthorVersions, uuid } from '@journals/core'
import type {
	UseCaseAuthorAdd,
	UseCaseAuthorDelete,
	UseCaseAuthorGet,
	UseCaseAuthorUpdate,
} from '@journals/usecases'
import { SqlAuthor } from './author.sql'

// interface RepoAuthor {
// 	readonly addAuthor: (
// 		params: UseCaseAuthorAdd,
// 	) => Effect.Effect<Author, ResultLengthMismatch | SqlError | ParseError>
// 	readonly deleteAuthor: (id: UseCaseAuthorDelete) => Effect.Effect<void>
// 	readonly getAuthor: (
// 		id: UseCaseAuthorGet,
// 	) => Effect.Effect<Option.Option<Author>>
// 	readonly updateAuthor: (
// 		id: string,
// 		params: UseCaseAuthorUpdate,
// 	) => Effect.Effect<Author, Cause.NoSuchElementException>
// }
// const RepoAuthor = Context.GenericTag<RepoAuthor>('@repositories/RepoAuthor')
const makeRepoAuthor = Effect.gen(function* (_) {
	const sql = yield* SqlAuthor

	// return RepoAuthor.of({})
	return {
		addAuthor: (params: UseCaseAuthorAdd) => {
			const newAuthor = new Author({
				...params,
				id: uuid(),
				created_at: Temporal.Now.zonedDateTimeISO(),
				version: AuthorVersions['1.0.0'],
			})
			return sql.insertAuthor(newAuthor)
		},
		deleteAuthor: (id: UseCaseAuthorDelete) => sql.deleteAuthor(id),
		getAuthor: (id: UseCaseAuthorGet) => sql.getAuthor(id),
		updateAuthor: (id: string, params: UseCaseAuthorUpdate) =>
			pipe(
				sql.getAuthor(id),
				Effect.andThen(maybeAuthor => {
					return Option.match(maybeAuthor, {
						onNone: () => Effect.fail(new Cause.NoSuchElementException()),
						onSome: author => {
							const updatedAuthor = new Author({
								...author,
								...params,
							})
							return sql.updateAuthor(updatedAuthor)
						},
					})
					// if (Option.isNone(maybeAuthor))
					// 	return Effect.fail(new Cause.NoSuchElementException())

					// const updatedAuthor = new Author({ ...maybeAuthor.value, ...params })
					// return sql.updateAuthor(updatedAuthor)
				}),
			),
	}
})
// export const repoAuthor = Effect.serviceFunctions(RepoAuthor)
// export const RepoAuthorLive = Layer.effect(RepoAuthor, makeRepoAuthor)
export class RepoAuthor extends Context.Tag('@repositories/RepoAuthor')<
	RepoAuthor,
	Effect.Effect.Success<typeof makeRepoAuthor>
>() {
	static live = Layer.effect(this, makeRepoAuthor).pipe(
		Layer.provide(SqlAuthor.live),
	)
}

// const makeRepoAuthorOld = Effect.gen(function* (_) {
// 	const refAuthors = yield* _(Ref.make(HashMap.empty<string, Author>()))

// 	const addAuthor = (params: UseCaseAuthorAdd): Effect.Effect<Author> => {
// 		const id = uuid()

// 		const newTodo = new Author({
// 			...params,
// 			id,
// 			created_at: Temporal.Now.zonedDateTimeISO(),
// 			version: authorV1_0_0,
// 		})

// 		Ref.modify(refAuthors, map => {
// 			const updated = HashMap.set(map, newTodo.id, newTodo)
// 			return [newTodo.id, updated]
// 		})

// 		return Effect.succeed(newTodo)
// 	}

// 	const deleteAuthor = (id: UseCaseAuthorDelete): Effect.Effect<void> =>
// 		Ref.get(refAuthors).pipe(
// 			Effect.flatMap(map =>
// 				HashMap.has(map, id)
// 					? Ref.set(refAuthors, HashMap.remove(map, id)).pipe(Effect.as(true))
// 					: Effect.succeed(false),
// 			),
// 		)

// 	const getAuthor = (
// 		id: UseCaseAuthorGet,
// 	): Effect.Effect<Option.Option<Author>> =>
// 		Ref.get(refAuthors).pipe(Effect.map(HashMap.get(id)))

// 	const updateAuthor = (
// 		id: string,
// 		params: UseCaseAuthorUpdate,
// 	): Effect.Effect<Author, Cause.NoSuchElementException> =>
// 		Ref.get(refAuthors).pipe(
// 			Effect.flatMap(map => {
// 				const maybeAuthor = HashMap.get(map, id)

// 				if (Option.isNone(maybeAuthor))
// 					return Effect.fail(new Cause.NoSuchElementException())

// 				const newAuthor = new Author({ ...maybeAuthor.value, ...params })
// 				const updated = HashMap.set(map, id, newAuthor)

// 				// 'Effect.as' transforms the result of the previous effect (which is the
// 				// successful update of the refAuthors) into returning the newAuthor object.
// 				return Ref.set(refAuthors, updated).pipe(Effect.as(newAuthor))
// 			}),
// 		)
// 	return {
// 		addAuthor,
// 		deleteAuthor,
// 		getAuthor,
// 		updateAuthor,
// 	}
// })
// export class RepoAuthor extends Effect.Tag('@repos/RepoAuthor')<
// 	RepoAuthor,
// 	Effect.Effect.Success<typeof makeRepoAuthor>
// >() {
// 	static Live = Layer.effect(this, makeRepoAuthor)
// }
// export class RepoAuthorOld extends Context.Tag('@repositories/RepoAuthorOld')<
// 	RepoAuthorOld,
// 	Effect.Effect.Success<typeof makeRepoAuthorOld>
// >() {
// 	static readonly Live = Layer.effect(RepoAuthorOld, makeRepoAuthorOld)
// }
