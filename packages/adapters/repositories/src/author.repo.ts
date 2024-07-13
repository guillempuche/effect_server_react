import { Cause, Context, Effect, Layer, Option, pipe } from 'effect'
import { Temporal } from 'temporal-polyfill'

import { Author, AuthorVersions, uuid } from '@journals/core'
import type {
	UseCaseAuthorAdd,
	UseCaseAuthorDelete,
	UseCaseAuthorGet,
	UseCaseAuthorUpdate,
} from '@journals/usecases'
import { SqlAuthor } from './author.sql.js'

const make = Effect.gen(function* (_) {
	const sql = yield* SqlAuthor

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
// export const RepoAuthorLive = Layer.effect(RepoAuthor, make)
export class RepoAuthor extends Context.Tag('@repositories/RepoAuthor')<
	RepoAuthor,
	Effect.Effect.Success<typeof make>
>() {
	static Base = Layer.effect(this, make)
	static Layer = Layer.provide(this.Base, SqlAuthor.Layer)
}
export type RepoAuthorType = Context.Tag.Service<RepoAuthor>
