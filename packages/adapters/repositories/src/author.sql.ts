import { Schema } from '@effect/schema'
import * as Sql from '@effect/sql'
import { Context, Effect, Layer } from 'effect'

import { Author } from '@journals/core'
import {
	UseCaseAuthorAdd,
	UseCaseAuthorDelete,
	UseCaseAuthorGet,
	UseCaseAuthorUpdate,
} from '@journals/usecases'
import { SqlLive } from './db'

export const makeSqlAuthor = Effect.gen(function* (_) {
	const sql = yield* Sql.client.Client

	const InsertAuthor = Sql.schema.single({
		Request: UseCaseAuthorAdd,
		Result: Author,
		execute: author => sql`INSERT INTO authors ${sql.insert(author)}`,
	})

	const DeleteAuthor = yield* Sql.resolver.ordered('AuthorDelete', {
		Request: UseCaseAuthorDelete,
		Result: Schema.Void,
		execute: ids => sql`DELETE FROM authors WHERE id IN ${sql.in(ids)}`,
	})

	const GetAuthor = yield* Sql.schema.findOne({
		Request: UseCaseAuthorGet,
		Result: Author,
		// ResultId: result => result.id,
		execute: ids => sql`SELECT * FROM authors WHERE id IN ${sql.in(ids)}`,
	})

	const UpdateAuthor = yield* Sql.schema. .ordered('AuthorUpdate', {
		Request: UseCaseAuthorUpdate,
		Result: Author,
		execute: requests => {
			const { id, ...rest } = requests
			return sql`UPDATE authors SET ${sql.update(
				rest,
			)} WHERE id = ${id} RETURNING authors.*`

			// const { id, ...rest } = requests[0]
			// return sql`UPDATE authors SET ${sql.update(
			// 	rest,
			// )} WHERE id = ${id} RETURNING authors.*`
		},
	})

	return {
		insertAuthor: InsertAuthor.execute,
		deleteAuthor: DeleteAuthor.execute,
		getAuthor: GetAuthor.execute,
		updateAuthor: UpdateAuthor.execute,
	}
})

// export const SqlAuthor = Context.Tag<ReturnType<typeof makeSqlAuthor>>(
// 	'@repositories/SqlAuthor',
// )
export class SqlAuthor extends Context.Tag('@repositories/SqlAuthor')<
	SqlAuthor,
	Effect.Effect.Success<typeof makeSqlAuthor>
>() {
	static live = Layer.effect(this, makeSqlAuthor)
	static layer = Layer.provide(this.live, SqlLive)
}
