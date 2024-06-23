import { Schema } from '@effect/schema'
import * as Sql from '@effect/sql'
import { Context, Effect, Layer } from 'effect'

import { Author, castTemporal } from '@journals/core'
import {
	UseCaseAuthorAdd,
	UseCaseAuthorDelete,
	UseCaseAuthorGet,
	UseCaseAuthorUpdate,
} from '@journals/usecases'
import { SqlLive } from './db.js'

const make = Effect.gen(function* (_) {
	const sql = yield* Sql.client.Client

	const InsertAuthor = Sql.schema.single({
		Request: UseCaseAuthorAdd,
		Result: Author,
		execute: author => sql`INSERT INTO authors ${sql.insert(author)}`,
	})

	const DeleteAuthor = Sql.schema.void({
		Request: UseCaseAuthorDelete,
		execute: id => sql`DELETE FROM authors WHERE id = ${id}`,
	})

	const GetAuthor = Sql.schema.findOne({
		Request: UseCaseAuthorGet,
		Result: Author,
		execute: id => sql`SELECT * FROM authors WHERE id = ${id}`,
	})

	const UpdateAuthor = Sql.schema.single({
		Request: UseCaseAuthorUpdate,
		Result: Author,
		execute: ({ id, updated_at, ...rest }) => {
			const updateData = updated_at
				? { ...rest, updated_at: castTemporal(updated_at) }
				: rest

			return sql`UPDATE authors SET ${sql.update(
				updateData,
			)} WHERE id = ${id} RETURNING authors.*`
		},
	})

	return {
		insertAuthor: InsertAuthor,
		deleteAuthor: DeleteAuthor,
		getAuthor: GetAuthor,
		updateAuthor: UpdateAuthor,
	}
})

// export const SqlAuthor = Context.Tag<ReturnType<typeof make>>(
// 	'@repositories/SqlAuthor',
// )
export class SqlAuthor extends Context.Tag('@repositories/SqlAuthor')<
	SqlAuthor,
	Effect.Effect.Success<typeof make>
>() {
	static Live = Layer.effect(this, make)
	// static Layer = Layer.provide(this.Live, SqlLive)
	// static Layer = Layer.provide(this.Live)
}
